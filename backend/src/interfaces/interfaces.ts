export interface IGmailController {
  getAttributes(): Promise<{values: string[], banks: string[]}>;
}

export interface IGmailGateway {
  getAttributes(auth: string): Promise<{messages: string[], banks: string[]}>;
}
