export const normalizeEmail = (email: string): string => {
    return email.toLowerCase().trim();
  }

export const normalizePhone = (phone: string): string => {    
    let normalized = phone.replace(/\D/g, '');
    
    if (normalized.startsWith('84')) {
      normalized = '0' + normalized.slice(2); 
    }
    
    return normalized;
}
