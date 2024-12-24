import { getAuth, getFirestore, createTimestamp, User } from '../config/firebase';
import { SodaEntry, UserGoals, CreateEntryBody, UpdateGoalsBody } from '../../soda-tracker-api/src/types';

// Auth Service
export const authService = {
  register: async (email: string, password: string) => {
    return getAuth().createUserWithEmailAndPassword(email, password);
  },

  login: async (email: string, password: string) => {
    return getAuth().signInWithEmailAndPassword(email, password);
  },

  logout: async () => {
    return getAuth().signOut();
  },

  getCurrentUser: (): User | null => {
    return getAuth().currentUser;
  },

  onAuthStateChanged: (callback: (user: User | null) => void) => {
    return getAuth().onAuthStateChanged(callback);
  }
};

// Soda Entries Service
export const sodaService = {
  createEntry: async (data: CreateEntryBody): Promise<SodaEntry> => {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const entry = {
      userId: user.uid,
      ...data,
      createdAt: createTimestamp().toDate().toISOString(),
      updatedAt: createTimestamp().toDate().toISOString()
    };

    const docRef = await getFirestore().collection('sodaEntries').add(entry);
    return {
      id: docRef.id,
      ...entry
    };
  },

  getEntries: async (startDate: Date, endDate: Date): Promise<SodaEntry[]> => {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const querySnapshot = await getFirestore()
      .collection('sodaEntries')
      .where('userId', '==', user.uid)
      .where('date', '>=', startDate.toISOString())
      .where('date', '<=', endDate.toISOString())
      .orderBy('date', 'asc')
      .get();

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<SodaEntry, 'id'>
    }));
  }
};

// User Goals Service
export const goalsService = {
  getUserGoals: async (): Promise<UserGoals> => {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const querySnapshot = await getFirestore()
      .collection('userGoals')
      .where('userId', '==', user.uid)
      .orderBy('updatedAt', 'desc')
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      // Create default goals
      const defaultGoals = {
        userId: user.uid,
        dailyLimit: 16,
        weeklyLimit: 64,
        targetReduction: 20,
        createdAt: createTimestamp().toDate().toISOString(),
        updatedAt: createTimestamp().toDate().toISOString()
      };

      const docRef = await getFirestore().collection('userGoals').add(defaultGoals);
      return {
        id: docRef.id,
        ...defaultGoals
      };
    }

    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data() as Omit<UserGoals, 'id'>
    };
  },

  updateGoals: async (data: UpdateGoalsBody): Promise<UserGoals> => {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const querySnapshot = await getFirestore()
      .collection('userGoals')
      .where('userId', '==', user.uid)
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      throw new Error('User goals not found');
    }

    const docRef = querySnapshot.docs[0].ref;
    const updatedGoals = {
      ...data,
      updatedAt: createTimestamp().toDate().toISOString()
    };

    await docRef.update(updatedGoals);

    return {
      id: docRef.id,
      userId: user.uid,
      ...data,
      createdAt: querySnapshot.docs[0].data().createdAt,
      updatedAt: updatedGoals.updatedAt
    };
  }
};