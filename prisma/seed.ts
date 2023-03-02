import { PrismaClient } from '@prisma/client'
import * as process from 'process'

const prisma = new PrismaClient()

const main = async () => {
  // await prisma.users.create({
  //     data: {
  //         email: 'marcin.wiatrak.95@gmail.com',
  //         firstName: 'Marcin',
  //         lastName: 'Wiatrak',
  //         role: 'ADMIN',
  //         password: 'abc123',
  //     }
  // });

  await prisma.orders.createMany({
    data: [
      {
        attachment: ['https://google.com'],
        createdAt: '2021-10-12T22:48:43+02:00',
        createdById: 1,
        localization: 'dupa',
        pickupDate: '2023-02-27T22:48:43+02:00',
        signature: 'ABCD',
        type: 'BIOLOGY',
        notes: 'TEST NOTE',
        // status: 'DELIVERED'
      },
      {
        attachment: ['https://google.com'],
        createdAt: '2021-10-12T22:48:43+02:00',
        createdById: 1,
        localization: 'dupa',
        pickupDate: '2023-02-27T22:48:43+02:00',
        signature: 'Biologia',
        type: 'BIOLOGY',
        notes: 'TEST notatka',
        // status: 'DELIVERED'
      },
      {
        attachment: ['https://google.com'],
        createdAt: '2021-10-12T22:48:43+02:00',
        createdById: 1,
        localization: 'dupa',
        pickupDate: '2023-02-27T22:48:43+02:00',
        signature: 'Fizykochemia',
        type: 'PHYSYCOCHEMISTRY',
        notes: 'TEST NOTE',
        // status: 'DELIVERED'
      },
      {
        attachment: ['https://google.com'],
        createdAt: '2021-10-12T22:48:43+02:00',
        createdById: 1,
        localization: 'dupa',
        pickupDate: '2023-02-27T22:48:43+02:00',
        signature: 'Toksykologia',
        type: 'TOXYCOLOGY',
        notes: 'TEST NOTE',
        // status: 'DELIVERED'
      },
      {
        attachment: ['https://google.com'],
        createdAt: '2021-10-12T22:48:43+02:00',
        createdById: 1,
        localization: 'dupa',
        pickupDate: '2023-02-27T22:48:43+02:00',
        signature: 'Toksykologia',
        type: 'TOXYCOLOGY',
        notes: 'Another note',
        // status: 'DELIVERED'
      },
    ],
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
