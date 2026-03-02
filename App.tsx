import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Tipo Contact: define a forma de cada contato
// TypeScript garante que todo contato tenha esses 4 campos
type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

// Chave que identifica os dados no AsyncStorage
const STORAGE_KEY = "@contacts_crud_v1";

export default function App() {

  // Lista de contatos -- comeca vazia
  const [contacts, setContacts] = useState<Contact[]>([]);

  // Campos do formulario -- comecam vazios
  const [name,  setName]  = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // editingId controla o modo do formulario:
  // null     -> modo CRIAR (botao = "Salvar")
  // "123..." -> modo EDITAR (botao = "Atualizar")
  const [editingId, setEditingId] = useState<string | null>(null);

  // isEditing e true quando editingId tem algum valor
  const isEditing = useMemo(() => editingId !== null, [editingId]);

  // ===== LER dados salvos no celular =====
  async function loadContacts() {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return;  // ainda nao tem nada salvo
      const parsed: Contact[] = JSON.parse(raw);
      setContacts(parsed);
    } catch (e) {
      Alert.alert("Erro", "Nao foi possivel carregar os dados.");
    }
  }

  // ===== SALVAR a lista inteira no celular =====
  async function saveContacts(next: Contact[]) {
    try {
      setContacts(next);  // atualiza a tela imediatamente
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      Alert.alert("Erro", "Nao foi possivel salvar os dados.");
    }
  }

  // Roda UMA VEZ quando o app abre -- carrega os dados salvos
  useEffect(() => {
    loadContacts();
  }, []);

  // ===== VALIDACAO dos campos =====
  function validate() {
    if (!name.trim())  return "Digite o nome.";
    if (!email.trim()) return "Digite o email.";
    if (!phone.trim()) return "Digite o telefone.";
    if (!email.includes("@")) return "Email invalido (falta @).";
    return null;  // null = tudo ok, pode salvar
  }

  // ===== C -- CREATE: criar contato novo =====
  async function handleCreate() {
    const err = validate();
    if (err) return Alert.alert("Atencao", err);

    const newContact: Contact = {
      id: String(Date.now()),  // id unico baseado no tempo
      name:  name.trim(),
      email: email.trim(),
      phone: phone.trim(),
    };

    const next = [newContact, ...contacts];  // novo vai para o inicio
    await saveContacts(next);
    setName(""); setEmail(""); setPhone("");  // limpa o formulario
  }

  // ===== U -- UPDATE: atualizar contato existente =====
  async function handleUpdate() {
    const err = validate();
    if (err) return Alert.alert("Atencao", err);
    if (!editingId) return;

    // .map() percorre a lista e substitui so o contato com o id certo
    const next = contacts.map((c) =>
      c.id === editingId
        ? { ...c, name: name.trim(), email: email.trim(), phone: phone.trim() }
        : c  // os outros ficam iguais
    );

    await saveContacts(next);
    setEditingId(null);  // sai do modo edicao
    setName(""); setEmail(""); setPhone("");
  }

  // ===== D -- DELETE: excluir contato =====
  async function handleDelete(id: string) {
    Alert.alert("Excluir", "Tem certeza que deseja excluir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          // .filter() cria lista nova SEM o contato com esse id
          const next = contacts.filter((c) => c.id !== id);
          await saveContacts(next);
        },
      },
    ]);
  }

  // Preenche o formulario com os dados do contato para editar
  function startEdit(contact: Contact) {
    setEditingId(contact.id);
    setName(contact.name);
    setEmail(contact.email);
    setPhone(contact.phone);
  }

  // Cancela a edicao e volta ao modo de criar
  function cancelEdit() {
    setEditingId(null);
    setName(""); setEmail(""); setPhone("");
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.title}>CRUD de Contatos</Text>

        {/* ===== FORMULARIO ===== */}
        <View style={styles.card}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Ex: Maria"
            style={styles.input}
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Ex: maria@email.com"
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Text style={styles.label}>Telefone</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Ex: (11) 99999-9999"
            style={styles.input}
            keyboardType="phone-pad"
          />
          <View style={styles.row}>
            {/* Botao muda de texto e funcao dependendo do modo */}
            <TouchableOpacity
              style={[styles.button, isEditing ? styles.btnUpdate : styles.btnSave]}
              onPress={isEditing ? handleUpdate : handleCreate}
            >
              <Text style={styles.btnText}>
                {isEditing ? "Atualizar" : "Salvar"}
              </Text>
            </TouchableOpacity>
            {/* Botao Cancelar so aparece no modo edicao */}
            {isEditing && (
              <TouchableOpacity
                style={[styles.button, styles.btnCancel]}
                onPress={cancelEdit}
              >
                <Text style={styles.btnText}>Cancelar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ===== LISTA ===== */}
        <Text style={styles.subtitle}>
          Contatos ({contacts.length})
        </Text>
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={
            <Text style={styles.empty}>
              Nenhum contato ainda. Salve o primeiro acima!
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemText}>{item.email}</Text>
                <Text style={styles.itemText}>{item.phone}</Text>
              </View>
              <View style={styles.itemActions}>
                <TouchableOpacity
                  style={[styles.smallBtn, styles.smallEdit]}
                  onPress={() => startEdit(item)}
                >
                  <Text style={styles.smallText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.smallBtn, styles.smallDel]}
                  onPress={() => handleDelete(item.id)}
                >
                  <Text style={styles.smallText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, padding: 16, gap: 12, backgroundColor: "#fff" },
  title:       { fontSize: 22, fontWeight: "800", marginBottom: 6 },
  subtitle:    { fontSize: 16, fontWeight: "700", marginTop: 8 },
  card: {
    borderWidth: 1, borderColor: "#e5e5e5",
    borderRadius: 12, padding: 12,
  },
  label:  { fontSize: 12, fontWeight: "700", marginTop: 10, marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: "#ddd", borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10,
  },
  row:    { flexDirection: "row", gap: 10, marginTop: 12 },
  button: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: "center" },
  btnSave:   { backgroundColor: "#111" },
  btnUpdate: { backgroundColor: "#0b5" },
  btnCancel: { backgroundColor: "#666" },
  btnText:   { color: "#fff", fontWeight: "800" },
  empty:     { marginTop: 10, color: "#666" },
  item: {
    flexDirection: "row", gap: 10,
    borderWidth: 1, borderColor: "#eee",
    borderRadius: 12, padding: 12, marginTop: 10,
  },
  itemName:    { fontSize: 16, fontWeight: "800" },
  itemText:    { color: "#444", marginTop: 2 },
  itemActions: { gap: 8, justifyContent: "center" },
  smallBtn: {
    paddingVertical: 8, paddingHorizontal: 12,
    borderRadius: 10, alignItems: "center",
  },
  smallEdit: { backgroundColor: "#1e88e5" },
  smallDel:  { backgroundColor: "#e53935" },
  smallText: { color: "#fff", fontWeight: "800" },
});