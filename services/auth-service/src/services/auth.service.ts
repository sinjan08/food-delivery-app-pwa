type RegisterInput = {
  name: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  zipCode: string;
  countryId: number;
  stateId: number;
  cityId: number;
}

class AuthService {
  async register(input: RegisterInput) {
    // Registration logic here
    return { message: 'User registered successfully', user: input };
  }

  async login(email: string, password: string) {
    // Login logic here
    return { message: 'User logged in successfully', email };
  }
}

export default new AuthService();