import { Tool } from './tool';

export class Convert {
    public static toToolArray(json: string): Tool[] {
        return JSON.parse(json);
    }
}