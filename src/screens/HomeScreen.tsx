import React, { useState, useEffect, useMemo } from "react";
import { SafeAreaView, Text, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Contact } from "../models/Contact";
import { StorageService } from "../services/StorageService";
import { ValidationService } from "../services/ValidationService";
import { ContactForm } from "../components/ContactForm";
import { ContactList } from "../components/ContactList";
import { styles } from "../styles/styles";

export function HomeScreen() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const isEditing = useMemo(() => editingId !== null, [editingId]);

  async function loadContacts() {
    try {
      const loaded = await StorageService.loadContacts();
      setContacts(loaded);
    } catch (e) {
      Alert.alert("Erro", "Não foi possível carregar os dados.");
    }
  }

  async function saveContacts(next: Contact[]) {
    try {
      setContacts(next);
      await StorageService.saveContacts(next);
    } catch (e) {
      Alert.alert("Erro", "Não foi possível salvar os dados.");
    }
  }

  useEffect(() => {
    loadContacts();
  }, []);

  async function handleCreate() {
    const err = ValidationService.validate(name, email, phone);
    if (err) return Alert.alert("Atenção", err);

    const formattedPhone = ValidationService.formatPhone(phone);

    const newContact: Contact = {
      id: String(Date.now()),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: formattedPhone,
    };

    await saveContacts([newContact, ...contacts]);
    setName("");
    setEmail("");
    setPhone("");
  }

  async function handleUpdate() {
    const err = ValidationService.validate(name, email, phone);
    if (err) return Alert.alert("Atenção", err);
    if (!editingId) return;

    const formattedPhone = ValidationService.formatPhone(phone);

    const next = contacts.map((c) =>
      c.id === editingId
        ? { ...c, name: name.trim(), email: email.trim().toLowerCase(), phone: formattedPhone }
        : c
    );

    await saveContacts(next);
    setEditingId(null);
    setName("");
    setEmail("");
    setPhone("");
  }

  async function handleDelete(id: string) {
    Alert.alert("Confirmar", "Deseja realmente excluir este contato?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          const next = contacts.filter((c) => c.id !== id);
          await saveContacts(next);
        },
      },
    ]);
  }

  function startEdit(contact: Contact) {
    setEditingId(contact.id);
    setName(contact.name);
    setEmail(contact.email);
    setPhone(contact.phone);
  }

  function cancelEdit() {
    setEditingId(null);
    setName("");
    setEmail("");
    setPhone("");
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.title}>Gerenciador de Contatos</Text>

        <ContactForm
          name={name}
          email={email}
          phone={phone}
          isEditing={isEditing}
          onNameChange={setName}
          onEmailChange={setEmail}
          onPhoneChange={setPhone}
          onSubmit={isEditing ? handleUpdate : handleCreate}
          onCancel={cancelEdit}
        />

        <Text style={styles.subtitle}>Lista de Contatos</Text>

        <ContactList contacts={contacts} onEdit={startEdit} onDelete={handleDelete} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
