const SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/~`;']/;

// Returns an error message, or '' if the password satisfies the policy.
export function getPasswordError(password) {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  if (!/[A-Z]/.test(password)) return 'Password must include at least 1 uppercase letter';
  if (!/[a-z]/.test(password)) return 'Password must include at least 1 lowercase letter';
  if (!/[0-9]/.test(password)) return 'Password must include at least 1 number';
  if (!SPECIAL_CHAR_REGEX.test(password)) return 'Password must include at least 1 special character';
  return '';
}
