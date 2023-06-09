import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
    {
      name: 'admin.db',
      location: '181.204.95.238:3306',
    },
    () => {
      console.log('Database connection established');
    },
    (error) => {
      console.log('Database connection error:', error);
    }
  );
  

  export default db;