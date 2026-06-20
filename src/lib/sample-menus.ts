export interface SampleImage {
  id: string
  src: string
  label: string
  labelZh: string
}

export interface SampleText {
  id: string
  filename: string
  label: string
  labelZh: string
  content: string
}

export const sampleImages: SampleImage[] = [
  {
    id: "img-001",
    src: "/sample-menus/001.jpg",
    label: "Menu Photo 1",
    labelZh: "菜单照片 1",
  },
  {
    id: "img-002",
    src: "/sample-menus/002.jpg",
    label: "Menu Photo 2",
    labelZh: "菜单照片 2",
  },
  {
    id: "img-003",
    src: "/sample-menus/003.jpg",
    label: "Menu Photo 3",
    labelZh: "菜单照片 3",
  },
  {
    id: "img-004",
    src: "/sample-menus/004.jpg",
    label: "Menu Photo 4",
    labelZh: "菜单照片 4",
  },
  {
    id: "img-005",
    src: "/sample-menus/005.jpg",
    label: "Menu Photo 5",
    labelZh: "菜单照片 5",
  },
]

export const sampleTexts: SampleText[] = [
  {
    id: "txt-006",
    filename: "006_sichuan_hotpot.txt",
    label: "Sichuan Hotpot",
    labelZh: "川菜火锅",
    content: "",
  },
  {
    id: "txt-007",
    filename: "007_cantonese_dimsum.txt",
    label: "Cantonese Dim Sum",
    labelZh: "粤式茶楼",
    content: "",
  },
  {
    id: "txt-008",
    filename: "008_western_restaurant.txt",
    label: "Western Restaurant",
    labelZh: "西餐厅",
    content: "",
  },
  {
    id: "txt-009",
    filename: "009_sichuan_restaurant.txt",
    label: "Sichuan Restaurant",
    labelZh: "川菜馆",
    content: "",
  },
  {
    id: "txt-010",
    filename: "010_japanese_restaurant.txt",
    label: "Japanese Restaurant",
    labelZh: "日料店",
    content: "",
  },
]
