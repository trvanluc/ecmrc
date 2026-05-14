export default function Footer() {
  return (
    <footer className="bg-base-300 text-base-content mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">LightNovel</h3>
            <p className="text-sm opacity-70">Thế giới Light Novel dành cho bạn</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Khám phá</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline">Sách mới</a></li>
              <li><a href="#" className="hover:underline">Thể loại</a></li>
              <li><a href="#" className="hover:underline">Bán chạy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline">Liên hệ</a></li>
              <li><a href="#" className="hover:underline">Hướng dẫn mua hàng</a></li>
              <li><a href="#" className="hover:underline">Chính sách đổi trả</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Theo dõi chúng tôi</h4>
            <p className="text-sm opacity-70">Facebook • Instagram • Discord</p>
          </div>
        </div>
        
        <div className="border-t border-base-300 mt-10 pt-6 text-center text-sm opacity-60">
          © 2026 Light Novel Online. All rights reserved.
        </div>
      </div>
    </footer>
  );
}