const logPass = {
   admin: {
    login: 'admin',
    password: ['admin'],
   },
   managers: {
    login: 'manager',
    password: ['man1', 'man2', 'man3'],
   } 
};
const getLogins = () => logPass;

export default getLogins;