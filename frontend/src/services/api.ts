import axios from "axios";
import type { LoginResponse} from './types';
import authStore from '../store/authStore';

class ApiService {

    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    public async login(email: string, password: string): Promise<boolean> {
        const url = `${this.baseUrl}/api/auth/login`;
        const response = await axios.post<LoginResponse>(
            url, { 'email': email, 'password': password}
        );
        
        authStore().login({
            email: email,
            access_token: response.data.access_token,
            token_type: response.data.token_type,
            expires_in: response.data.expires_in,
        });

        return true;
    }
}

export default ApiService;