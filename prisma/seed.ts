import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

// Prisma 7 requires an adapter
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@wut.edu.cn" },
    update: {},
    create: {
      email: "admin@wut.edu.cn",
      passwordHash: adminPassword,
      name: "系统管理员",
      role: "ADMIN",
    },
  });
  console.log("Admin user created:", admin.email);

  const studentPassword = await bcrypt.hash("123456", 12);
  const student = await prisma.user.upsert({
    where: { email: "student@example.com" },
    update: {},
    create: {
      email: "student@example.com",
      passwordHash: studentPassword,
      name: "测试学生",
      role: "STUDENT",
    },
  });
  console.log("Student user created:", student.email);

  const subjects = [
    { name: "高等数学A（上）", code: "MATH2001", college: "理学院", description: "函数、极限、导数、积分等基础内容" },
    { name: "高等数学A（下）", code: "MATH2002", college: "理学院", description: "多元函数微积分、曲线曲面积分、无穷级数" },
    { name: "线性代数", code: "MATH2003", college: "理学院", description: "矩阵理论、线性方程组、特征值特征向量" },
    { name: "概率论与数理统计", code: "MATH2004", college: "理学院", description: "随机事件、分布、参数估计、假设检验" },
    { name: "大学物理A（上）", code: "PHY3001", college: "理学院", description: "力学、热学、电磁学基础" },
    { name: "大学物理A（下）", code: "PHY3002", college: "理学院", description: "光学、量子物理、近代物理" },
    { name: "大学英语1", code: "ENG1001", college: "外国语学院", description: "综合英语听说读写基础" },
    { name: "大学英语2", code: "ENG1002", college: "外国语学院", description: "英语综合能力提升" },
    { name: "大学英语3", code: "ENG1003", college: "外国语学院", description: "学术英语与跨文化交际" },
    { name: "大学英语4", code: "ENG1004", college: "外国语学院", description: "高级英语综合技能" },
    { name: "C语言程序设计", code: "CS1001", college: "计算机科学与技术学院", description: "C语言基础语法、指针、结构体、文件操作" },
    { name: "Python程序设计", code: "CS1002", college: "计算机科学与技术学院", description: "Python基础、面向对象、常用库" },
    { name: "数据结构", code: "CS2001", college: "计算机科学与技术学院", description: "线性表、树、图、排序、查找算法" },
    { name: "计算机组成原理", code: "CS2002", college: "计算机科学与技术学院", description: "计算机硬件系统、CPU、存储器、I/O系统" },
    { name: "操作系统", code: "CS3001", college: "计算机科学与技术学院", description: "进程管理、内存管理、文件系统" },
    { name: "计算机网络", code: "CS3002", college: "计算机科学与技术学院", description: "TCP/IP协议栈、路由、应用层协议" },
    { name: "数据库原理", code: "CS3003", college: "计算机科学与技术学院", description: "关系模型、SQL、范式、事务管理" },
    { name: "马克思主义基本原理", code: "POL1001", college: "马克思主义学院", description: "马克思主义哲学、政治经济学、科学社会主义" },
    { name: "毛泽东思想和中国特色社会主义理论", code: "POL2001", college: "马克思主义学院", description: "毛泽东思想、中国特色社会主义理论体系" },
    { name: "思想道德与法治", code: "POL1002", college: "马克思主义学院", description: "人生观、价值观、法律基础" },
    { name: "中国近现代史纲要", code: "POL1003", college: "马克思主义学院", description: "近现代中国历史发展进程" },
    { name: "工程图学", code: "ME1001", college: "机电工程学院", description: "工程制图基础、三视图、零件图" },
    { name: "电路原理", code: "EE2001", college: "自动化学院", description: "电路基本定律、分析方法、交流电路" },
    { name: "模拟电子技术", code: "EE2002", college: "信息工程学院", description: "二极管、三极管、运放电路" },
    { name: "数字电子技术", code: "EE2003", college: "信息工程学院", description: "逻辑代数、组合逻辑、时序逻辑" },
  ];

  for (const subject of subjects) {
    await prisma.subject.upsert({
      where: { name: subject.name },
      update: {},
      create: subject,
    });
  }
  console.log(`${subjects.length} subjects created`);
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
