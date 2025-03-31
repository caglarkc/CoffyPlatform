// Tarih formatlama fonksiyonu
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Kullanıcı durumu formatlama
export const formatUserStatus = (status) => {
  const statusMap = {
    'active': 'Aktif',
    'notVerified': 'Doğrulanmamış',
    'blocked': 'Engellenmiş',
    'deleted': 'Silinmiş'
  };
  
  return statusMap[status] || status;
};

// Telefon numarası formatlama
export const formatPhoneNumber = (phone) => {
  if (!phone) return '-';
  
  // Telefon numarası format: +90 (5XX) XXX-XX-XX
  const cleaned = ('' + phone).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{3})(\d{3})(\d{2})(\d{2})$/);
  
  if (match) {
    return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
  }
  
  return phone;
};

// Ad soyad formatlama
export const formatName = (name, surname) => {
  if (!name && !surname) return '-';
  return `${name || ''} ${surname || ''}`.trim();
};

// Kısa metin oluşturma (uzun metinler için)
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '-';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
