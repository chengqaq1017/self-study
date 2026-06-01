import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { COLLEGE_NAME, TRAINING_PLAN_SOURCE } from "../src/lib/colleges";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

const courseNames = [
  "CAD/CAM 应用与创新实践",
  "专业英语",
  "中国近现代史纲要",
  "传热学 C",
  "传热学 D",
  "体育 1",
  "体育 2",
  "体育 3",
  "体育 4",
  "信号分析与处理",
  "储能原理与技术",
  "内燃机与动力装置匹配",
  "内燃机排放控制 A",
  "内燃机测试技术 A",
  "内燃机课程设计",
  "军事技能训练",
  "军事理论",
  "分布式能源系统",
  "制冷与空调技术",
  "动力定位及机桨优化配置",
  "动力机械工程微机应用技术",
  "动力机械振动理论及应用",
  "动力机械电子控制技术 A",
  "动力机械监测与控制",
  "动力系统建模与仿真 A",
  "动力系统自动化 B",
  "可再生能源与新能源技术",
  "声学理论及应用",
  "复变函数与积分变换 B",
  "复变函数与积分变换 C",
  "大学物理 B",
  "大学英语 1",
  "大学英语 2",
  "大学英语 3",
  "大学英语 4",
  "大数据与船联网技术",
  "工程力学 B",
  "工程力学 B 实验",
  "工程图学 B",
  "工程图学 C",
  "工程热力学 A",
  "工程热力学与传热学 B",
  "工程热力学与传热学实验",
  "工程热力学和传热学课程设计",
  "工程计算基础 A",
  "形势与政策",
  "心理健康教育",
  "思想道德与法治",
  "振动与噪声控制",
  "控制工程基础 C",
  "数值计算",
  "新能源及智能船舶动力系统",
  "新能源热利用与发电技术",
  "智能船舶 Python 语言应用",
  "智能船舶技术",
  "机器人技术与智能船舶",
  "机械制造工程实训 A",
  "机械制造工程实训 B",
  "机械制造工程实训 C",
  "机械设计基础 A",
  "机械设计基础课程设计",
  "材料力学 C",
  "概率论与数理统计 B",
  "毕业实习和毕业设计",
  "氢能与制氢技术",
  "水下系统与探测技术",
  "流体力学 C",
  "海洋可再生能源",
  "海洋可再生能源开发技术",
  "海洋工程装备技术",
  "海洋工程装备概论 B",
  "海洋平台建造工艺",
  "混合动力系统原理",
  "混合动力系统概论",
  "热与流体课程实验",
  "燃烧学",
  "燃烧学导论",
  "物理实验 B",
  "特种发动机结构与原理",
  "现场总线技术与应用",
  "理论力学 B",
  "生产实习",
  "电力电子变流技术",
  "电工与电子技术基础 A",
  "电工与电子技术基础 B",
  "电工与电子技术基础 C",
  "电工与电子技术基础 D",
  "电工电子实习 B",
  "Python 程序设计基础 B",
  "线性代数",
  "结构有限元仿真技术与应用",
  "能源与动力工程专业实验",
  "能源与动力工程专业英语",
  "能源动力工程材料",
  "能源动力测试技术",
  "能源动力测试技术实验",
  "能源动力系统原理",
  "能源动力系统课程设计",
  "能源概论",
  "自动控制原理 B",
  "船体强度与结构设计",
  "船体强度与结构设计课程设计",
  "船体构造与制图",
  "船体构造与制图课程设计",
  "船体结构综合实验",
  "船厂轮机专业技术谈判",
  "船机安装与检验",
  "船用发动机实验",
  "船用发动机拆装与操作训练",
  "船用辅机拆装与操作训练",
  "船舶与海洋工程创新创业实践",
  "船舶与海洋工程安全规范",
  "船舶与海洋工程概论",
  "船舶与海洋工程结构物可靠性",
  "船舶与海洋工程虚拟水池实践",
  "船舶动力系统仿真",
  "船舶动力装置原理 B",
  "船舶动力装置工艺学",
  "船舶单片机原理及应用",
  "船舶原理 C",
  "船舶建造工艺学 G",
  "船舶建造工艺学课程设计",
  "船舶推进",
  "船舶操纵性与耐波性",
  "船舶数值水池技术与应用",
  "船舶智能设计制造原理与系统",
  "船舶机械制造工艺学 C",
  "船舶机械智能制造",
  "船舶柴油机 A1",
  "船舶柴油机 B",
  "船舶水动力性能综合实验",
  "船舶污染控制",
  "船舶流体力学",
  "船舶流体力学实验",
  "船舶清洁能源技术",
  "船舶清洁能源技术 A",
  "船舶电力系统及推进技术",
  "船舶电工实训",
  "船舶电气",
  "船舶电气与自动化实验",
  "船舶电气实验",
  "船舶电气设备与系统 C",
  "船舶管理 B",
  "船舶管系与工艺设计 B",
  "船舶管系与工艺设计 C",
  "船舶结构材料与焊接",
  "船舶能效操作",
  "船舶腐蚀与防护",
  "船舶自动化实训",
  "船舶自动化实验",
  "船舶自动控制原理",
  "船舶认识实习",
  "船舶设计原理 F",
  "船舶设计原理课程设计",
  "船舶辅机 A1",
  "船舶辅机 B",
  "船舶辅机实验",
  "船舶防污染技术 A",
  "船舶静力学",
  "认识实习",
  "轮机图纸设计",
  "轮机工程基础",
  "轮机工程测试技术",
  "轮机模拟器训练",
  "轮机管理专业实习",
  "轮机自动化 A",
  "轮机自动化 B",
  "轮机自动化基础",
  "轮机英语",
  "轮机英语 B",
  "轮机英语听力与会话训练",
  "透平机械原理",
  "造船机械设备与自动化",
  "金属工艺学 B",
  "马克思主义基本原理",
  "高性能船舶水动力原理",
  "高等数学 A 上",
  "高等数学 A 下",
];

async function seedOptionalAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    console.log("Skipped admin user: set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD to create one.");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: "ADMIN" },
    create: {
      email,
      passwordHash,
      name: "系统管理员",
      role: "ADMIN",
    },
  });

  console.log("Admin user ready:", admin.email);
}

async function main() {
  console.log("Seeding database...");
  await seedOptionalAdmin();

  for (const [index, name] of courseNames.entries()) {
    await prisma.subject.upsert({
      where: { name },
      update: {
        code: `NAOEP2024-${String(index + 1).padStart(3, "0")}`,
        college: COLLEGE_NAME,
        description: TRAINING_PLAN_SOURCE,
      },
      create: {
        name,
        code: `NAOEP2024-${String(index + 1).padStart(3, "0")}`,
        college: COLLEGE_NAME,
        description: TRAINING_PLAN_SOURCE,
      },
    });
  }

  const removed = await prisma.subject.deleteMany({
    where: {
      name: { notIn: courseNames },
      materials: { none: {} },
    },
  });

  console.log(`${courseNames.length} NAOEP courses created or updated.`);
  if (removed.count > 0) {
    console.log(`${removed.count} obsolete empty subjects removed.`);
  }
  console.log("Seeding complete!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
