
import { Product, Category, User } from './types';

export const MOCK_USERS: User[] = [
    { 
        id: 1, 
        name: 'Jane Doe', 
        email: 'jane.doe@example.com',
        avatar: 'https://picsum.photos/seed/janedoe/100/100',
        accountType: 'user',
        rating: { average: 4.8, count: 12 },
        favoriteSellers: [3, 4],
    },
    { 
        id: 2, 
        name: 'John Smith', 
        email: 'john.smith@example.com',
        avatar: 'https://picsum.photos/seed/johnsmith/100/100',
        accountType: 'business',
        rating: { average: 4.5, count: 8 } 
    },
    { 
        id: 3, 
        name: 'Gadget Galaxy', 
        email: 'emily.white@example.com',
        avatar: 'https://picsum.photos/seed/emilywhite/100/100',
        accountType: 'business',
        rating: { average: 5.0, count: 21 }
    },
    { 
        id: 4, 
        name: 'Mike Brown', 
        email: 'mike.brown@example.com',
        avatar: 'https://picsum.photos/seed/mikebrown/100/100',
        accountType: 'user',
        rating: { average: 4.2, count: 5 }
    },
];

export const MOCK_USER: User = MOCK_USERS[0];

export const CATEGORIES: Category[] = [
    { id: 'cars', name: 'Cars', iconName: 'CarIcon', icon: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=300&q=80' },
    { id: 'properties', name: 'Properties', iconName: 'BuildingOfficeIcon', icon: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=300&q=80' },
    { id: 'mobiles', name: 'Mobiles', iconName: 'DevicePhoneMobileIcon', icon: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80' },
    { id: 'laptops', name: 'Laptops', iconName: 'ComputerDesktopIcon', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGsMz9g3T9PfjNeDzAEoCqWCfjp53afA-f8Q&s' },
    { id: 'jobs', name: 'Jobs', iconName: 'BriefcaseIcon', icon: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=300&q=80' },
    { id: 'bikes', name: 'Bikes', iconName: 'BikeIcon', icon: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=300&q=80' },
    { id: 'electronics', name: 'Electronics & Appliances', iconName: 'DeviceTabletIcon', icon: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=300&q=80' },
    { id: 'commercial', name: 'Commercial Vehicles', iconName: 'TruckIcon', icon: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=300&q=80' },
    { id: 'furniture', name: 'Furniture', iconName: 'FurnitureIcon', icon: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80' },
    { id: 'fashion', name: 'Fashion', iconName: 'TShirtIcon', icon: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=300&q=80' },
    { id: 'hobbies', name: 'Books, Sports & Hobbies', iconName: 'BookOpenIcon', icon: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80' },
    { id: 'pets', name: 'Pets', iconName: 'PawIcon', icon: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&q=80' },
    { id: 'services', name: 'Services', iconName: 'WrenchIcon', icon: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=300&q=80' },
];

export const INITIAL_PRODUCTS: Product[] = [
    {
        id: '3',
        title: 'iPhone 14 Pro - 256GB, Deep Purple',
        description: 'Excellent condition iPhone 14 Pro, unlocked. No scratches on the screen. Battery health at 95%. Comes with the original box and charging cable. Features the Dynamic Island, ProMotion technology, and the best camera system on a smartphone.',
        price: 800,
        category: 'mobiles',
        location: 'Los Angeles, CA',
        imageUrls: ['https://picsum.photos/seed/phone1/800/600', 'https://picsum.photos/seed/phone1-2/800/600', 'https://picsum.photos/seed/phone1-3/800/600'],
        seller: MOCK_USERS[2],
        postedDate: '2024-07-21',
        status: 'active',
        details: {
            brand: 'Apple',
            storage: '256GB',
            ram: '6GB',
            condition: 'Used - Like New',
        },
    },
    {
        id: '4',
        title: 'Men\'s Classic Leather Jacket',
        description: 'A timeless biker-style leather jacket made from 100% genuine lambskin. Features a classic asymmetrical zip, multiple pockets, and a comfortable inner lining. Perfect for all seasons. Size: Medium.',
        price: 120,
        category: 'fashion',
        location: 'New York, NY',
        imageUrls: ['https://picsum.photos/seed/jacket1/800/600'],
        seller: MOCK_USERS[1],
        postedDate: '2024-07-18',
        status: 'active',
    },
    {
        id: '5',
        title: 'Bose QuietComfort 45 Headphones',
        description: 'Industry-leading noise cancellation for immersive sound. Crystal clear audio for music and calls. Comes with carrying case and charging cable. Used for about a year, in perfect working condition.',
        price: 150,
        category: 'electronics',
        location: 'Chicago, IL',
        imageUrls: ['https://picsum.photos/seed/electronics1/800/600'],
        seller: MOCK_USERS[2],
        postedDate: '2024-07-22',
        status: 'active',
    },
    {
        id: '6',
        title: 'The Midnight Library by Matt Haig',
        description: 'A captivating and imaginative novel about choices, regrets, and the infinite possibilities of life. Hardcover edition in pristine, like-new condition. A must-read for fans of contemporary fiction.',
        price: 15,
        category: 'hobbies',
        location: 'Miami, FL',
        imageUrls: ['https://picsum.photos/seed/book1/800/600'],
        seller: MOCK_USERS[1],
        postedDate: '2024-07-15',
        status: 'active',
        details: {
            author: 'Matt Haig',
            condition: 'Used - Like New',
        },
    },
    {
        id: '8',
        title: 'Samsung Galaxy S22 Ultra, 128GB',
        description: 'Flagship Android phone with an amazing camera and built-in S Pen. 128GB, Phantom Black. Always used with a case and screen protector. Unlocked for all carriers.',
        price: 700,
        category: 'mobiles',
        location: 'Austin, TX',
        imageUrls: ['https://picsum.photos/seed/phone2/800/600'],
        seller: MOCK_USERS[2],
        postedDate: '2024-07-21',
        status: 'active',
    }
];
