import 'dotenv/config'
import { PrismaClient, BossType } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const bossData = [
  {
    name: '狂戰士瓦格',
    teleportPoint: '聖所監視哨所',
    type: BossType.RARE,
    respawnHours: 1,
    specialDrop: false
  },
  {
    name: '黑色戰士阿埃德',
    teleportPoint: '無名墓地',
    type: BossType.RARE,
    respawnHours: 0.5,
    specialDrop: false
  },
  {
    name: '忠實的拉吉特',
    teleportPoint: '聖所監視哨所',
    type: BossType.RARE,
    respawnHours: 0.5,
    specialDrop: false
  },
  {
    name: '黑闘比修貝達',
    teleportPoint: '拉格塔要塞',
    type: BossType.LEGACY,
    respawnHours: 6,
    specialDrop: true
  },
  {
    name: '德拉坎部隊兵器古魯塔',
    teleportPoint: '葛利巴德峽谷東部',
    type: BossType.LEGACY,
    respawnHours: 6,
    specialDrop: true
  },
  {
    name: '敏銳的敘拉克',
    teleportPoint: '因派圖西姆廣場',
    type: BossType.LEGACY,
    respawnHours: 6,
    specialDrop: true
  },
  {
    name: '藍色水波凱匹那',
    teleportPoint: '淨化之森',
    type: BossType.LEGACY,
    respawnHours: 2,
    specialDrop: false
  },
  {
    name: '靈魂支配者卡沙帕',
    teleportPoint: '法夫奈特埋藏地',
    type: BossType.UNIQUE,
    respawnHours: 6,
    specialDrop: true
  },
  {
    name: '不滅卡爾吐亞',
    teleportPoint: '不滅之島',
    type: BossType.UNIQUE,
    respawnHours: 12,
    specialDrop: true
  },
  {
    name: '軍團長拉格塔',
    teleportPoint: '拉格塔要塞',
    type: BossType.UNIQUE,
    respawnHours: 12,
    specialDrop: true
  },
  {
    name: '精靈王阿格羅',
    teleportPoint: '希埃爾之翼群島',
    type: BossType.UNIQUE,
    respawnHours: 12,
    specialDrop: true
  },
  {
    name: '融化的達納樂',
    teleportPoint: '德雷得奇安失事地',
    type: BossType.RARE,
    respawnHours: 0.5,
    specialDrop: false
  },
  {
    name: '血戰士蘭那爾',
    teleportPoint: '瑪斯蘭森林',
    type: BossType.RARE,
    respawnHours: 1.5,
    specialDrop: false
  },
  {
    name: '捕食者加爾桑',
    teleportPoint: '瑪斯蘭森林',
    type: BossType.LEGACY,
    respawnHours: 2,
    specialDrop: false
  },
  {
    name: '欺瞞者特里德',
    teleportPoint: '烏爾通海姆',
    type: BossType.LEGACY,
    respawnHours: 2,
    specialDrop: false
  },
  {
    name: '沉默塔爾坦',
    teleportPoint: '淨化之森',
    type: BossType.UNIQUE,
    respawnHours: 6,
    specialDrop: true
  },
  {
    name: '參謀官勒沙納',
    teleportPoint: '德拉那克圖斯',
    type: BossType.LEGACY,
    respawnHours: 3,
    specialDrop: false
  },
  {
    name: '總監督官努塔',
    teleportPoint: '德拉那克圖斯',
    type: BossType.LEGACY,
    respawnHours: 2,
    specialDrop: false
  },
  {
    name: '別動隊長令克斯',
    teleportPoint: '巴斯斐爾特廢墟',
    type: BossType.LEGACY,
    respawnHours: 3,
    specialDrop: false
  },
  {
    name: '蹂躪者諾布魯德',
    teleportPoint: '巴斯斐爾特廢墟',
    type: BossType.LEGACY,
    respawnHours: 4,
    specialDrop: true
  },
  {
    name: '亡魂執政官亞克席歐斯',
    teleportPoint: '巴斯斐爾特廢墟',
    type: BossType.LEGACY,
    respawnHours: 4,
    specialDrop: true
  },
  {
    name: '中毒的哈迪倫',
    teleportPoint: '法夫奈特埋藏地',
    type: BossType.LEGACY,
    respawnHours: 3,
    specialDrop: false
  },
  {
    name: '處刑者巴爾西恩',
    teleportPoint: '葛利巴德峽谷西部',
    type: BossType.LEGACY,
    respawnHours: 4,
    specialDrop: true
  },
  {
    name: '百戰老將舒札坎',
    teleportPoint: '黑爪部落',
    type: BossType.LEGACY,
    respawnHours: 3,
    specialDrop: false
  },
  {
    name: '祕傳卡魯卡',
    teleportPoint: '黑爪部落',
    type: BossType.LEGACY,
    respawnHours: 4,
    specialDrop: true
  },
  {
    name: '監視者卡伊拉',
    teleportPoint: '艾雷修藍塔下層',
    type: BossType.UNIQUE,
    respawnHours: 1,
    specialDrop: true
  }
]

async function main() {
  console.log('開始種子資料...')

  for (const boss of bossData) {
    await prisma.boss.create({
      data: boss
    })
  }

  console.log(`成功建立 ${bossData.length} 筆首領資料`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
