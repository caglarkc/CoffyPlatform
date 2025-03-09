const AuthService = require('../services/auth.service');

class AuthController {

    constructor() {
        this.authService = AuthService;
    }
    
    async checkPhone(req, res, next) {
        const { phone } = req.query;
        const message = await this.authService.checkPhone(phone);
        return res.status(200).json(message);
    }

    async checkEmail(req, res, next) {
        const { email } = req.query;
        const message = await this.authService.checkEmail(email);
        return res.status(200).json(message);
    }

    async register(req, res, next) {
        try {
            console.log('Register request received:', req.body);
            const { name, surname, email, phone, password } = req.body;
            
            const message = await this.authService.register({ name, surname, email, phone, password });
            console.log('User registered successfully:', message);
            return res.status(201).json(message);
        } catch (error) {
            // Hata mesajını controller katmanında loglamıyoruz
            // Hatayı error middleware'e iletiyoruz
            next(error);
        }
    }

    async sendVerificationEmail(req, res, next) {
        try {
            const { email } = req.body;
            const message = await this.authService.sendVerificationEmail(email);
            return res.status(200).json(message);
            
        } catch (error) {
            // Hata mesajını controller katmanında loglamıyoruz
            next(error);
        }
    }
    
    async verifyEmail(req, res, next) {
        try {
            const { email, code } = req.body;
            const message = await this.authService.verifyEmail(email, code);
            console.log('Email verified successfully:', message);
            return res.status(200).json(message);
        } catch (error) {
            // Hata mesajını controller katmanında loglamıyoruz
            next(error);
        }
    }

    async getTime(req, res, next) {
        const now = () => new Date();
        
        console.log("Şu anki zaman:", now().toString());
    }
}

module.exports = new AuthController();

