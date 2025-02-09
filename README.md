# Courier Chef - Kurye Yönetim Sistemi

Courier Chef, birden fazla sipariş uygulamasından, birden fazla restoranta gelen siparişlerin atolye tarafında yönetilmesini ve kuryelerle atanmasını sağlayan, teslimat sürecini yöneten bir uygulamadır.

## Kurulum

Bu proje turborepo monorepo alt yapısı üzerinde pnpm ile hazırlanmıştır.

- Eğer sisteminizde pnpm yüklü değilse [burayı](https://pnpm.io/installation) takip ediniz

- Bu projeyi çalıştırmak için engine requirement node 18 ve üzeri olarak seçilmiştir. Lütfen sisteminizdeki node versiyonunu kontrol edip düşük versiyonda ise node'u güncelleyiniz.

## Temel Kavram üzerinde yapılan değişiklikler

### Sipariş (Order)

- **restaurant**: siparişlere içerisinde restoran adı, restoran id ve restoran konumu bulunan bir kolon eklendi
- **basket_id**: bire çok ilişkiyi tamamlamak adına siparişlere sepet id kolunu eklendi

### Courier (Kurye)

- **basket_id**: bire bir ilişkiyi tamamlamanak adına kuryeye sepet id eklendi

### Basket (Sepet)

- **delivered_by**: tamamlanmış siparişin kimin tarafiından teslim edildiğini görmek için eklendi

## Özellikler

### Preparing (Mutfakta) Kolonu

- Bu kolonda sadece siparişler bulunabilir
- Bu kolonda yer alan tüm siparişlerin durumları <code>preparing</code> şeklindedir
- Siparişler bu kolondan <code>On the Shelf</code> kolonuna, sipariş üzerindeki <code>mark as prepared</code> butonuna tıklamak suretiyle geçirilebilir

### On the Shelf (Rafta) Kolonu

- Bu kolonda hem siparişler hem de sepetler yer alabilir
- Burada gösterien tüm sipariş ve sepetlerin durumları <code>prepared</code> şeklindedir
- Bu kolondaki sepetlenmemiş bir sipariş sepete ekle selecti kullanarak mevcut bir sepete eklenebilir yada çevresinde yeni sepet oluşturulabilir
- Sepet içerisindeki siparişler sepetten çıkara basılarak sepet dışına çıkarılabilir
- Bu kolondaki sepetler silinebilir. Silinmeleri takdirinde içerilerindeki sipraişler sepetten çıkartılıp yine bu kolon altına toplanacaktır
- Bu kolondaki sepetlere, kurye ata selecti kullanılarak sepeta kurye atanabilir. Kurye seçenekleri arasında sadece müsait kuryeler yer almaktadır (Rafta yada yolda olan sepetlere atanmamış kuryeler)
- Buradaki bir sepet sadece altında bir veya daha fazla sipariş varsa vede üzerine kurye atanmışsa yola çıkabilir

### On the Way (Yolda) Kolonu

- Bu kolonda sadece sepetler bulunabilir
- Burada bulunan sepetlerin ve içerisindeki siparişlerin durumu <code>on_the_way</code> şeklindedir.
- Buradaki sepet silinemez, içerisindeki sipariş dışarı çıkarılamaz, sepete başka kurye atanamaz
- Sepet altındaki tüm siparişler teslim edilirse sepet otomatik olarak teslim edilmiş sayılır. Teslim eden kısmına kuryenin adı girilir. Kurye id kısmı boşaltılır.

## Teknolojiler

- React
- TypeScript
- Ant Design
- TailwindCSS
- React Query
- Turborepo
- Vite
- pnpm (paket yöneticisi)

## Kurulum

### Gereksinimler

- Node.js (>= 18)
- pnpm (>= 8.15.6)

### Adımlar

1. Repoyu klonlayın:
