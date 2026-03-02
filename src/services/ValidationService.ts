export const ValidationService = {
  validate(name: string, email: string, phone: string): string | null {
    if (!name.trim()) return "Digite o nome.";
    if (!email.trim()) return "Digite o email.";
    if (!phone.trim()) return "Digite o telefone.";
    
    // Validar nome (apenas letras e espaços)
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(name.trim())) {
      return "Nome deve conter apenas letras.";
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return "Email inválido.";
    }
    
    // Validar telefone (apenas números, mínimo 10, máximo 11)
    const phoneNumbers = phone.replace(/\D/g, "");
    if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
      return "Telefone deve ter 10 ou 11 dígitos.";
    }
    
    return null;
  },
  
  formatPhone(value: string): string {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    return numbers.slice(0, 11).replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  },
};
