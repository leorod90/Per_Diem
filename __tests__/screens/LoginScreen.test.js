describe('Login validation', () => {
  let mockToastShow;

  beforeEach(() => {
    mockToastShow = jest.fn();
    global.Toast = { show: mockToastShow };
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const loginHandler = (email, password, signInFn) => {
    if (!validateEmail(email)) {
      return { error: 'Invalid Email', message: 'Please enter a valid email address.' };
    }
    if (!validatePassword(password)) {
      return { error: 'Invalid Password', message: 'Password must be 6 characters or longer.' };
    }
    signInFn(email, password);
    return { success: true };
  };

  it('rejects invalid email', () => {
    const result = loginHandler('invalid-email', 'password123', jest.fn());
    expect(result.error).toBe('Invalid Email');
  });

  it('rejects short password', () => {
    const result = loginHandler('test@example.com', '123', jest.fn());
    expect(result.error).toBe('Invalid Password');
  });

  it('accepts valid credentials', () => {
    const mockSignIn = jest.fn();
    const result = loginHandler('test@example.com', 'password123', mockSignIn);
    expect(result.success).toBe(true);
    expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('validates various email formats', () => {
    expect(validateEmail('user@domain.com')).toBe(true);
    expect(validateEmail('user.name@domain.com')).toBe(true);
    expect(validateEmail('invalid')).toBe(false);
    expect(validateEmail('invalid@')).toBe(false);
    expect(validateEmail('@domain.com')).toBe(false);
  });

  it('validates password length', () => {
    expect(validatePassword('12345')).toBe(false);
    expect(validatePassword('123456')).toBe(true);
    expect(validatePassword('longerpassword')).toBe(true);
  });
});