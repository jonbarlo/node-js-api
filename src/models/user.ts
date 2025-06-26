export interface User {
    id: number;
    name: string;
    email: string;
}
export const users: User[] = [
    { id: 1, name: 'John Doe', email: 'johndoe@email.com' },
    { id: 2, name: 'Jane Doe', email: 'janedoe@email.com' }
];
export const getUsers = () => {
    return users;
};
export const getUserById = (id: number) => {
    return users.find(user => user.id === id);
};