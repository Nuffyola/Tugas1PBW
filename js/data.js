
var userData = [
  {
    id: 1,
    name: "Rina Wulandari",
    email: "rina@ut.ac.id",
    password: "rina123",
    role: "UPBJJ-UT",
    location: "UPBJJ Jakarta"
  },
  {
    id: 2,
    name: "Agus Pranoto",
    email: "agus@ut.ac.id",
    password: "agus123",
    role: "UPBJJ-UT",
    location: "UPBJJ Makassar"
  },
  {
    id: 3,
    name: "Siti Marlina",
    email: "siti@ut.ac.id",
    password: "siti123",
    role: "Puslaba",
    location: "Central"
  },
  {
    id: 4,
    name: "Doni Setiawan",
    email: "doni@ut.ac.id",
    password: "doni123",
    role: "Faculty",
    location: "FISIP"
  },
  {
    id: 5,
    name: "Admin SITTA",
    email: "admin@ut.ac.id",
    password: "admin123",
    role: "Administrator",
    location: "Central"
  }
];

var teachingMaterialsData = [
  {
    locationCode: "0TMP01",
    itemCode: "ASIP4301",
    itemName: "Introduction to Communication Studies",
    itemType: "BMP",
    edition: "2",
    stock: 548,
    cover: "img/pengantar_komunikasi.jpg"
  },
  {
    locationCode: "0JKT01",
    itemCode: "EKMA4216",
    itemName: "Financial Management",
    itemType: "BMP",
    edition: "3",
    stock: 392,
    cover: "img/manajemen_keuangan.jpg"
  },
  {
    locationCode: "0SBY02",
    itemCode: "EKMA4310",
    itemName: "Leadership",
    itemType: "BMP",
    edition: "1",
    stock: 278,
    cover: "img/kepemimpinan.jpg"
  },
  {
    locationCode: "0MLG01",
    itemCode: "BIOL4211",
    itemName: "Basic Microbiology",
    itemType: "BMP",
    edition: "2",
    stock: 165,
    cover: "img/mikrobiologi.jpg"
  },
  {
    locationCode: "0UPBJJBDG",
    itemCode: "PAUD4401",
    itemName: "Early Childhood Development",
    itemType: "BMP",
    edition: "4",
    stock: 204,
    cover: "img/paud_perkembangan.jpg"
  }
];

var trackingData = {
  "2023001234": {
    deliveryOrderNumber: "2023001234",
    name: "Rina Wulandari",
    status: "In Transit",
    courier: "JNE",
    shippingDate: "2025-08-25",
    package: "0JKT01",
    total: "Rp 180,000",
    journey:[
      {
        time: "2025-08-25 10:12:20",
        description: "Received at Counter: SOUTH TANGERANG. Sender: Universitas Terbuka"
      },
      {
        time: "2025-08-25 14:07:56",
        description: "Arrived at Hub: SOUTH TANGERANG"
      },      
      {
        time: "2025-08-25 10:12:20",
        description: "Forwarded to South Jakarta Office"
      },
    ]
  },
  "2023005678": {
    deliveryOrderNumber: "2023001234",
    name: "Agus Pranoto",
    status: "Delivered",
    courier: "Pos Indonesia",
    shippingDate: "2025-08-25",
    package: "0UPBJJBDG",
    total: "Rp 220,000",
    journey:[
      {
        time: "2025-08-25 10:12:20",
        description: "Received at Counter: SOUTH TANGERANG. Sender: Universitas Terbuka"
      },
      {
        time: "2025-08-25 14:07:56",
        description: "Arrived at Hub: SOUTH TANGERANG"
      },      
      {
        time: "2025-08-25 16:30:10",
        description: "Forwarded to Bandung City Office"
      },
      {
        time: "2025-08-26 12:15:33",
        description: "Arrived at Hub: BANDUNG City"
      },
      {
        time: "2025-08-26 15:06:12",
        description: "Delivery in progress to Cimahi"
      },
      {
        time: "2025-08-26 20:00:00",
        description: "Delivery Completed. Recipient: Agus Pranoto"
      }
    ]
  }
};