import { Injectable } from '@nestjs/common';
import { IEncryptionService } from '../../application/use-cases/CreateCredential/CreateCredentialUseCase';
import { SecretAlgorithm } from '../../domain/enums/SecretAlgorithm';

@Injectable()
export class LocalEncryptionService implements IEncryptionService {
  public async encrypt(plainText: string): Promise<{ encryptedValue: string; algorithm: string; keyReference?: string }> {
    // In Sprint 5.1, this is a placeholder passthrough as agreed with the user.
    // Base64 encoding provides a minimal transformation to simulate encryption.
    const base64Encoded = Buffer.from(plainText, 'utf8').toString('base64');
    
    return {
      encryptedValue: base64Encoded,
      algorithm: SecretAlgorithm.PLAINTEXT,
      keyReference: undefined
    };
  }

  public async decrypt(encryptedValue: string, algorithm: string, keyReference?: string): Promise<string> {
    if (algorithm === SecretAlgorithm.PLAINTEXT) {
      return Buffer.from(encryptedValue, 'base64').toString('utf8');
    }
    throw new Error(`Algorithm ${algorithm} is not supported by LocalEncryptionService`);
  }
}
