import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { styles } from "../styles/styles";

type ContactFormProps = {
  name: string;
  email: string;
  phone: string;
  isEditing: boolean;
  onNameChange: (text: string) => void;
  onEmailChange: (text: string) => void;
  onPhoneChange: (text: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export function ContactForm({
  name,
  email,
  phone,
  isEditing,
  onNameChange,
  onEmailChange,
  onPhoneChange,
  onSubmit,
  onCancel,
}: ContactFormProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Nome:</Text>
      <TextInput
        value={name}
        onChangeText={onNameChange}
        placeholder="Digite o nome"
        style={styles.input}
        maxLength={50}
      />
      <Text style={styles.label}>Email:</Text>
      <TextInput
        value={email}
        onChangeText={onEmailChange}
        placeholder="Digite o email"
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        maxLength={100}
      />
      <Text style={styles.label}>Telefone:</Text>
      <TextInput
        value={phone}
        onChangeText={onPhoneChange}
        placeholder="(00) 00000-0000"
        style={styles.input}
        keyboardType="phone-pad"
        maxLength={15}
      />
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.button, isEditing ? styles.btnUpdate : styles.btnSave]}
          onPress={onSubmit}
        >
          <Text style={styles.btnText}>{isEditing ? "Atualizar" : "Salvar"}</Text>
        </TouchableOpacity>
        {isEditing && (
          <TouchableOpacity style={[styles.button, styles.btnCancel]} onPress={onCancel}>
            <Text style={styles.btnText}>Cancelar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
