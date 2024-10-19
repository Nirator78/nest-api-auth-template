import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async getTokenInfosInHeaders(headers: any) {
    try {
      // On isole le token de l'entête de la requête
      const authHeader = headers.authorization;

      // On split le chaine pour enlever le "Beared" au début
      const token = authHeader && authHeader.split(" ")[1];

      // On traduit le token pour recupérer les infos à l'intérieur
      return await this.jwtService.verify(token);
    } catch (error) {
      throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
    }
  }
}
