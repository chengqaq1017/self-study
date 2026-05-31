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
    { name: "理论力学", code: "NAE2024-001", college: "船海与能源动力工程学院", description: "船舶、海洋与能源动力类专业力学基础课程" },
    { name: "材料力学", code: "NAE2024-002", college: "船海与能源动力工程学院", description: "构件强度、刚度、稳定性分析基础" },
    { name: "机械设计基础", code: "NAE2024-003", college: "船海与能源动力工程学院", description: "机械零部件设计与传动基础" },
    { name: "工程材料及成型技术", code: "NAE2024-004", college: "船海与能源动力工程学院", description: "工程材料性能、加工与成型工艺基础" },
    { name: "船舶与海洋工程概论", code: "NAE2024-005", college: "船海与能源动力工程学院", description: "船舶与海洋工程专业导论课程" },
    { name: "船舶静力学", code: "NAE2024-006", college: "船海与能源动力工程学院", description: "船舶浮性、稳性、抗沉性等船舶原理基础" },
    { name: "船舶流体力学", code: "NAE2024-007", college: "船海与能源动力工程学院", description: "船舶水动力学与流体力学专业基础" },
    { name: "船舶阻力", code: "NAE2024-008", college: "船海与能源动力工程学院", description: "船舶阻力机理、估算与试验分析" },
    { name: "船舶推进", code: "NAE2024-009", college: "船海与能源动力工程学院", description: "推进器性能、推进系统匹配与设计基础" },
    { name: "船舶操纵性与耐波性", code: "NAE2024-010", college: "船海与能源动力工程学院", description: "船舶操纵运动、波浪中运动与性能评估" },
    { name: "船舶结构力学", code: "NAE2024-011", college: "船海与能源动力工程学院", description: "船体结构受力、变形与强度分析" },
    { name: "船体构造与制图", code: "NAE2024-012", college: "船海与能源动力工程学院", description: "船体结构组成、图样表达与制图规范" },
    { name: "船体强度与结构设计", code: "NAE2024-013", college: "船海与能源动力工程学院", description: "船体梁强度、局部强度与结构设计" },
    { name: "船舶设计原理", code: "NAE2024-014", college: "船海与能源动力工程学院", description: "船舶总体设计、方案论证与主要尺度确定" },
    { name: "船舶建造工艺学", code: "NAE2024-015", college: "船海与能源动力工程学院", description: "船体建造流程、分段建造与总装工艺" },
    { name: "船舶与海洋结构物先进制造技术", code: "NAE2024-016", college: "船海与能源动力工程学院", description: "船舶与海洋结构物现代制造与智能建造技术" },
    { name: "船舶与海洋结构物有限元分析", code: "NAE2024-017", college: "船海与能源动力工程学院", description: "结构有限元建模、计算与工程应用" },
    { name: "海洋工程环境学", code: "NAE2024-018", college: "船海与能源动力工程学院", description: "海洋环境载荷、波浪、风流与工程环境基础" },
    { name: "海洋平台与海洋工程结构物", code: "NAE2024-019", college: "船海与能源动力工程学院", description: "海洋平台类型、结构体系与工程设计基础" },
    { name: "船舶与海洋工程专业英语", code: "NAE2024-020", college: "船海与能源动力工程学院", description: "船舶与海洋工程领域英文文献和技术表达" },
    { name: "工程热力学A", code: "NAE2024-021", college: "船海与能源动力工程学院", description: "热力系统、能量转换与热机循环基础" },
    { name: "传热学D", code: "NAE2024-022", college: "船海与能源动力工程学院", description: "导热、对流、辐射传热及工程应用" },
    { name: "流体力学C", code: "NAE2024-023", college: "船海与能源动力工程学院", description: "能源动力与船舶工程中的流体力学基础" },
    { name: "能源概论", code: "NAE2024-024", college: "船海与能源动力工程学院", description: "能源类型、能源转换与能源系统导论" },
    { name: "能源动力系统原理", code: "NAE2024-025", college: "船海与能源动力工程学院", description: "能源动力装置系统组成、循环与性能分析" },
    { name: "船舶动力装置原理B", code: "NAE2024-026", college: "船海与能源动力工程学院", description: "船舶主推进动力装置原理、系统与匹配" },
    { name: "船舶机械智能制造", code: "NAE2024-027", college: "船海与能源动力工程学院", description: "船舶机械制造过程、数字化与智能制造技术" },
    { name: "内燃机原理D", code: "NAE2024-028", college: "船海与能源动力工程学院", description: "内燃机工作过程、性能与排放基础" },
    { name: "燃烧学", code: "NAE2024-029", college: "船海与能源动力工程学院", description: "燃烧过程、燃烧组织与动力装置应用" },
    { name: "热工测量与自动控制", code: "NAE2024-030", college: "船海与能源动力工程学院", description: "热工参数测量、仪表与控制基础" },
    { name: "新能源船舶技术", code: "NAE2024-031", college: "船海与能源动力工程学院", description: "船舶新能源动力、低碳燃料与绿色船舶技术" },
    { name: "船舶辅机", code: "NAE2024-032", college: "船海与能源动力工程学院", description: "船舶辅助机械设备原理、运行与维护" },
    { name: "轮机工程基础", code: "NAE2024-033", college: "船海与能源动力工程学院", description: "轮机系统、动力装置与船舶机舱基础" },
    { name: "轮机维护与修理", code: "NAE2024-034", college: "船海与能源动力工程学院", description: "轮机设备维护、故障诊断与修理工艺" },
    { name: "轮机自动化", code: "NAE2024-035", college: "船海与能源动力工程学院", description: "船舶机舱自动化控制、监测与报警系统" },
    { name: "轮机英语", code: "NAE2024-036", college: "船海与能源动力工程学院", description: "轮机工程专业英语与船舶机务技术交流" },
    { name: "船舶柴油机", code: "NAE2024-037", college: "船海与能源动力工程学院", description: "船用柴油机结构、工作过程、运行与维护" },
    { name: "船舶电气设备", code: "NAE2024-038", college: "船海与能源动力工程学院", description: "船舶电力系统、电气设备与安全运行" },
    { name: "船舶动力装置安装工艺", code: "NAE2024-039", college: "船海与能源动力工程学院", description: "船舶动力装置安装、调试与工艺组织" },
    { name: "轮机工程测试技术", code: "NAE2024-040", college: "船海与能源动力工程学院", description: "轮机系统测试、数据采集与性能分析" },
    { name: "船舶管路系统", code: "NAE2024-041", college: "船海与能源动力工程学院", description: "船舶管系设计、布置、安装与运行维护" },
    { name: "船舶防污染技术", code: "NAE2024-042", college: "船海与能源动力工程学院", description: "船舶污染控制、排放法规与环保设备" },
    { name: "船舶安全与管理", code: "NAE2024-043", college: "船海与能源动力工程学院", description: "船舶安全管理、风险控制与法规基础" },
    { name: "水力学", code: "NAE2024-044", college: "船海与能源动力工程学院", description: "港航与海岸工程中的水流运动与水力计算" },
    { name: "土力学与地基基础", code: "NAE2024-045", college: "船海与能源动力工程学院", description: "土体力学性质、地基承载与基础设计" },
    { name: "港口规划与布置", code: "NAE2024-046", college: "船海与能源动力工程学院", description: "港口总体规划、码头布置与港区功能组织" },
    { name: "港口水工建筑物", code: "NAE2024-047", college: "船海与能源动力工程学院", description: "码头、防波堤、护岸等港口水工结构设计" },
    { name: "航道工程学", code: "NAE2024-048", college: "船海与能源动力工程学院", description: "航道整治、疏浚、通航条件与工程设计" },
    { name: "海岸动力学", code: "NAE2024-049", college: "船海与能源动力工程学院", description: "波浪、潮流、泥沙输运与海岸演变" },
    { name: "海岸工程学", code: "NAE2024-050", college: "船海与能源动力工程学院", description: "海岸防护、近岸工程结构与海岸带开发" },
    { name: "港口装卸工艺", code: "NAE2024-051", college: "船海与能源动力工程学院", description: "港口装卸系统、设备选型与作业组织" },
  ];

  for (const subject of subjects) {
    await prisma.subject.upsert({
      where: { name: subject.name },
      update: {
        code: subject.code,
        college: subject.college,
        description: subject.description,
      },
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
