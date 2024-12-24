interface SodaEntry {
  id: string;
  date: string;
  amount: number; // in fl oz
  brand: string;
  calories: number;
  sugar: number; // in grams
  carbs: number; // in grams
  caffeine: number; // in mg
}

interface UserGoals {
  dailyLimit: number; // in fl oz
  weeklyLimit: number; // in fl oz
  targetReduction: number; // percentage
}

export const COMMON_SIZES = [
  { label: '7.5 fl oz (Mini Can)', value: 7.5 },
  { label: '8 fl oz (Small)', value: 8 },
  { label: '12 fl oz (Can)', value: 12 },
  { label: '16 fl oz (Medium)', value: 16 },
  { label: '16.9 fl oz (Bottle)', value: 16.9 },
  { label: '20 fl oz (Large)', value: 20 },
  { label: '24 fl oz (XL)', value: 24 },
  { label: '1 Liter (33.8 fl oz)', value: 33.8 },
  { label: '2 Liter (67.6 fl oz)', value: 67.6 },
];

export const SODA_BRANDS = [
  {
    name: 'Coca-Cola',
    variants: [
      {
        name: 'Coca-Cola Classic',
        per12oz: { calories: 140, sugar: 39, carbs: 39, caffeine: 34 },
      },
      {
        name: 'Diet Coke',
        per12oz: { calories: 0, sugar: 0, carbs: 0, caffeine: 46 },
      },
      {
        name: 'Coke Zero Sugar',
        per12oz: { calories: 0, sugar: 0, carbs: 0, caffeine: 34 },
      },
      {
        name: 'Caffeine Free Coke',
        per12oz: { calories: 140, sugar: 39, carbs: 39, caffeine: 0 },
      },
    ],
  },
  {
    name: 'Pepsi',
    variants: [
      {
        name: 'Pepsi',
        per12oz: { calories: 150, sugar: 41, carbs: 41, caffeine: 38 },
      },
      {
        name: 'Diet Pepsi',
        per12oz: { calories: 0, sugar: 0, carbs: 0, caffeine: 35 },
      },
      {
        name: 'Pepsi Zero Sugar',
        per12oz: { calories: 0, sugar: 0, carbs: 0, caffeine: 69 },
      },
      {
        name: 'Caffeine Free Pepsi',
        per12oz: { calories: 150, sugar: 41, carbs: 41, caffeine: 0 },
      },
    ],
  },
  {
    name: 'Mountain Dew',
    variants: [
      {
        name: 'Mountain Dew',
        per12oz: { calories: 170, sugar: 46, carbs: 46, caffeine: 54 },
      },
      {
        name: 'Diet Mountain Dew',
        per12oz: { calories: 0, sugar: 0, carbs: 0, caffeine: 54 },
      },
      {
        name: 'Mountain Dew Zero Sugar',
        per12oz: { calories: 0, sugar: 0, carbs: 0, caffeine: 68 },
      },
      {
        name: 'Mountain Dew Code Red',
        per12oz: { calories: 170, sugar: 46, carbs: 46, caffeine: 54 },
      },
    ],
  },
  {
    name: 'Dr Pepper',
    variants: [
      {
        name: 'Dr Pepper',
        per12oz: { calories: 150, sugar: 40, carbs: 40, caffeine: 41 },
      },
      {
        name: 'Diet Dr Pepper',
        per12oz: { calories: 0, sugar: 0, carbs: 0, caffeine: 41 },
      },
      {
        name: 'Dr Pepper Zero Sugar',
        per12oz: { calories: 0, sugar: 0, carbs: 0, caffeine: 41 },
      },
      {
        name: 'Caffeine Free Dr Pepper',
        per12oz: { calories: 150, sugar: 40, carbs: 40, caffeine: 0 },
      },
    ],
  },
  {
    name: 'Sprite',
    variants: [
      {
        name: 'Sprite',
        per12oz: { calories: 140, sugar: 38, carbs: 38, caffeine: 0 },
      },
      {
        name: 'Sprite Zero Sugar',
        per12oz: { calories: 0, sugar: 0, carbs: 0, caffeine: 0 },
      },
    ],
  },
  {
    name: 'Fanta',
    variants: [
      {
        name: 'Fanta Orange',
        per12oz: { calories: 160, sugar: 44, carbs: 44, caffeine: 0 },
      },
      {
        name: 'Fanta Orange Zero Sugar',
        per12oz: { calories: 0, sugar: 0, carbs: 0, caffeine: 0 },
      },
      {
        name: 'Fanta Grape',
        per12oz: { calories: 160, sugar: 44, carbs: 44, caffeine: 0 },
      },
      {
        name: 'Fanta Strawberry',
        per12oz: { calories: 160, sugar: 44, carbs: 44, caffeine: 0 },
      },
    ],
  },
];

class MockApiService {
  private sodaEntries: SodaEntry[] = [];
  private userGoals: UserGoals = {
    dailyLimit: 16, // 16 fl oz
    weeklyLimit: 64, // 64 fl oz
    targetReduction: 20, // 20%
  };

  async logSodaConsumption(entry: Omit<SodaEntry, 'id'>): Promise<SodaEntry> {
    const newEntry = {
      ...entry,
      id: Date.now().toString(),
    };
    this.sodaEntries.push(newEntry);
    return newEntry;
  }

  async getSodaEntries(startDate: Date, endDate: Date): Promise<SodaEntry[]> {
    return this.sodaEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= startDate && entryDate <= endDate;
    });
  }

  async getUserGoals(): Promise<UserGoals> {
    return this.userGoals;
  }

  async updateUserGoals(goals: UserGoals): Promise<UserGoals> {
    this.userGoals = goals;
    return goals;
  }

  async getDailyStats(date: Date): Promise<{
    totalConsumption: number;
    remainingAllowance: number;
    totalCalories: number;
    totalSugar: number;
    totalCarbs: number;
    totalCaffeine: number;
  }> {
    const dateStart = new Date(date);
    const dateEnd = new Date(date);
    dateStart.setHours(0, 0, 0, 0);
    dateEnd.setHours(23, 59, 59, 999);

    const entries = await this.getSodaEntries(dateStart, dateEnd);

    const totalConsumption = entries.reduce((sum, entry) => sum + entry.amount, 0);

    return {
      totalConsumption,
      remainingAllowance: this.userGoals.dailyLimit - totalConsumption,
      totalCalories: entries.reduce((sum, entry) => sum + entry.calories, 0),
      totalSugar: entries.reduce((sum, entry) => sum + entry.sugar, 0),
      totalCarbs: entries.reduce((sum, entry) => sum + entry.carbs, 0),
      totalCaffeine: entries.reduce((sum, entry) => sum + entry.caffeine, 0),
    };
  }
}

export const mockApi = new MockApiService();