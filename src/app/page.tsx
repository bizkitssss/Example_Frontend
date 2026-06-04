export default function Home() {
  return (
    <div className="text-center py-20">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">ยินดีต้อนรับสู่ Application UI</h2>
      <p className="text-gray-600 mb-8">กรุณาเลือกเมนูทางด้านซ้ายเพื่อดูผลลัพธ์ของแต่ละ Requirement</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <div key={num} className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-default">
            <span className="font-semibold">Requirement #{num}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
