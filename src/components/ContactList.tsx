import React from "react";
import { FlatList, View, Text, TouchableOpacity } from "react-native";
import { Contact } from "../models/Contact";
import { styles } from "../styles/styles";

type ContactListProps = {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
};

export function ContactList({ contacts, onEdit, onDelete }: ContactListProps) {
  return (
    <FlatList
      data={contacts}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingBottom: 24 }}
      ListEmptyComponent={
        <Text style={styles.empty}>Nenhum contato cadastrado.</Text>
      }
      renderItem={({ item }) => (
        <View style={styles.item}>
          <View style={styles.itemHeader}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemText}>Email: {item.email}</Text>
              <Text style={styles.itemText}>Telefone: {item.phone}</Text>
            </View>
            <View style={styles.itemActions}>
              <TouchableOpacity
                style={[styles.smallBtn, styles.smallEdit]}
                onPress={() => onEdit(item)}
              >
                <Text style={styles.smallText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.smallBtn, styles.smallDel]}
                onPress={() => onDelete(item.id)}
              >
                <Text style={styles.smallText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    />
  );
}
