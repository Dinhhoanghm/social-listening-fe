function removeVietnameseTones(str) {
  return str
    .normalize('NFD') // Chuyển Unicode tổ hợp
    .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

export function searchVietnamese(text, keyword) {
  const cleanText = removeVietnameseTones(text).toLowerCase();
  const cleanKeyword = removeVietnameseTones(keyword).toLowerCase();
  return cleanText.indexOf(cleanKeyword) !== -1;
}
