export class User {

    id: number;
    name: string;

    constructor(obj: any) {
        this.id = obj.id;
        this.name = obj.name
    }
}