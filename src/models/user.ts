export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
}

export interface UserWithoutPassword {
    id: number;
    name: string;
    email: string;
}

export const users: User[] = [
    { id: 1, name: 'John Doe', email: 'johndoe@email.com', password: '$2a$10$example.hash.for.john' },
    { id: 2, name: 'Jane Doe', email: 'janedoe@email.com', password: '$2a$10$example.hash.for.jane' }
];

export const getUsers = (): UserWithoutPassword[] => {
    return users.map(user => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    });
};

export const getUserById = (id: number): UserWithoutPassword | undefined => {
    const user = users.find(user => user.id === id);
    if (!user) return undefined;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

export const getUserByEmail = (email: string): User | undefined => {
    return users.find(user => user.email === email);
};

export const createUser = (name: string, email: string, hashedPassword: string): User => {
    const newUser: User = {
        id: users.length + 1,
        name,
        email,
        password: hashedPassword
    };
    users.push(newUser);
    return newUser;
};