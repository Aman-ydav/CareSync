// utils/avatarGenerator.js

/**
 * Generate cartoon avatar URL based on user info
 * Using DiceBear API with different styles
 */
export const generateAvatar = (user) => {
  const { fullName, gender, role } = user;
  
  // Different avatar styles based on role
  const avatarStyles = {
    DOCTOR: 'adventurer', // Professional but friendly
    PATIENT: 'avataaars', // Fun and colorful
    ADMIN: 'bottts', // Tech/robotic style
  };

  // Get initials for seeding
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get avatar style based on role
  const style = avatarStyles[role] || 'avataaars';
  
  // Create seed from initials
  const seed = getInitials(fullName) || 'User';
  
  // Color palette
  const colors = [
    'FFAD08', 'FFD166', '06D6A0', '118AB2', 'EF476F',
    '7209B7', '3A86FF', 'FB5607', '8338EC', 'FF006E'
  ];
  
  // Random color from palette
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  // Base URL for DiceBear API (free, no API key needed)
  const baseUrl = 'https://api.dicebear.com/7.x';
  
  // Construct URL
  const avatarUrl = `${baseUrl}/${style}/svg?seed=${seed}&backgroundColor=${color}`;
  
  return avatarUrl;
};

/**
 * Fallback avatar if no image is provided
 */
export const getFallbackAvatar = (userData) => {
  const { fullName, gender, role } = userData;
  
  // Different background colors based on gender
  const genderColors = {
    Male: ['4CC9F0', '4361EE', '3A0CA3', '4895EF'],
    Female: ['F72585', 'B5179E', '7209B7', '560BAD'],
    Other: ['06D6A0', '0FA3B1', 'F0A202', 'F18805']
  };
  
  // Different styles based on role
  const roleStyles = {
    DOCTOR: 'lorelei', // More professional
    PATIENT: 'micah',  // Casual
    ADMIN: 'miniavs'   // Techy
  };
  
  const style = roleStyles[role] || 'micah';
  const colors = genderColors[gender] || ['7209B7', '3A86FF', '06D6A0'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  const seed = fullName || 'User';
  
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=${color}&radius=50`;
};

/**
 * Generate avatar URL for upload to Cloudinary
 * This is used when user doesn't upload their own avatar
 */
export const generateAndUploadAvatar = async (user) => {
  // If user has uploaded avatar, use it
  if (user.avatar && user.avatar.startsWith('http')) {
    return user.avatar;
  }
  
  // Otherwise generate cartoon avatar
  return generateAvatar(user);
};