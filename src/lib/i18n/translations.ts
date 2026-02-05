export const translations = {
    en: {
        welcome: {
            secureAccess: "Secure Partnership Access",
            enterDashboard: "Enter Dashboard"
        },
        sidebar: {
            overview: "Overview",
            orders: "Orders",
            clients: "Clients",
            menu: "Menu Management",
            chatbot: "Chatbot WhatsApp",
            delivery: "Restau Plus Delivery",
            integrations: "Integrations",
            settings: "Settings",
            messages: "R+ Messages",
            dashboard: "Dashboard",
            management: "Management",
            admin: "Admin",
            adminConsole: "Admin Console",
            contactSupport: "Contact R+ Support",
            logout: "Logout",
            visitWebsite: "Visit Our Restaurant",
            new: "New",
            soon: "Soon",
            pro: "Pro"
        },
        overview: {
            viewActiveOrders: "View Active Orders",
            editMenu: "Edit Menu",
            totalRevenue: "Total Revenue",
            allTimeEarnings: "All time earnings",
            todaysRevenue: "Today's Revenue",
            performanceToday: "Performance today",
            activeOrders: "Active Orders",
            ordersInKitchen: "Orders in kitchen",
            pendingIncome: "Income (pending)",
            unpaidOrders: "Unpaid orders",
            totalOrders: "Total Orders",
            allTimeOrders: "All time orders",
            dailyOrders: "Daily Orders",
            ordersToday: "Orders today",
            popularItems: "Popular Items",
            noSalesData: "No sales data yet",
            viewFullMenu: "View Menu Performance",
            recentActivity: "Recent Activity",
            refresh: "Refresh Overview",
            refreshing: "Refreshing..."
        },
        charts: {
            weekly: "Weekly",
            monthly: "Monthly",
            yearly: "Yearly",
            totalGrowth: "Total Growth",
            revenue: "Revenue"
        },
        calendar: {
            profitCalendar: "Profit Calendar",
            orders: "orders",
            dailyProfit: "Daily Profit"
        },
        ordersPage: {
            title: "Kitchen View",
            subtitle: "Manage real-time orders and preparation status.",
            status: {
                open: "Open for Orders",
                closed: "Closed",
                openMsg: "Restaurant is now OPEN for orders",
                closedMsg: "Restaurant is now CLOSED for orders",
                label: "Order Status",
                error: "Failed to update status"
            },
            metrics: {
                responseTime: "Response Time",
                placedToPreparing: "Placed to Preparing",
                cookTime: "Cook Time",
                preparingToReady: "Preparing to Ready",
                serviceSpeed: "Service Speed",
                readyToServed: "Ready to Served",
                totalDineIn: "Total Dine In",
                totalTakeAway: "Total Take Away",
                min: "min"
            },
            board: {
                new: "New Orders",
                preparing: "Preparing",
                ready: "Ready",
                served: "Served",
                columns: {
                    new: "New",
                    preparing: "Preparing",
                    ready: "Ready",
                    served: "Served"
                },
                noOrders: "No active orders",
                table: "Table",
                takeaway: "Takeaway",
                item: "Item",
                note: "Note",
                actions: {
                    markPreparing: "Start Preparing",
                    markReady: "Mark Ready",
                    markServed: "Mark Served",
                    markPaid: "Mark Paid",
                    cancel: "Cancel Order"
                }
            }
        },
        menuPage: {
            title: "Menu Management",
            subtitle: "Curate your master culinary collection.",
            itemsCount: "items",
            searchPlaceholder: "Search your menu...",
            categories: "Categories",
            newItem: "New Item",
            noItems: {
                title: "No items found",
                desc: "Try adjusting your search or add a new item to your menu."
            },
            dialog: {
                editTitle: "Edit Item",
                newTitle: "New Item",
                labels: {
                    name: "Item Name",
                    namePlaceholder: "e.g. Truffle Mushroom Burger",
                    price: "Price",
                    status: "Status",
                    category: "Category",
                    description: "Description",
                    descPlaceholder: "Describe the ingredients, taste, and story...",
                    image: "Visual Asset",
                    chooseImage: "Choose Image File...",
                    pasteUrl: "Paste image URL..."
                },
                status: {
                    available: "Available (Live)",
                    soldOut: "Sold Out (Visible but Unorderable)",
                    hidden: "Hidden (Not Visible)"
                },
                categories: {
                    select: "Select Category...",
                    new: "+ New Category",
                    placeholder: "Category Name",
                    manageTitle: "Manage Categories",
                    noCategories: "No categories yet."
                },
                variants: {
                    groupName: "New Choice Group (e.g. Size, Sauce)",
                    groupPlaceholder: "Group Name",
                    noVariants: "No custom choices yet.",
                    addDesc: 'Add "Sauces", "Sizes", or "Toppings" above.',
                    selectionType: "Selection Type",
                    full: "Required?",
                    single: "Single",
                    multi: "Multi",
                    optionName: "Option Name (e.g. Extra Cheese)",
                    price: "Price (+)",
                    add: "Add"
                },
                save: "Save Creation",
                saving: "Saving...",
                cancel: "Cancel"
            }
        },
        settingsPage: {
            title: "Settings",
            subtitle: "Manage your restaurant profile, appearance, and connectivity.",
            save: "Save Changes",
            tabs: {
                general: "General",
                branding: "Branding",
                contact: "Contact",
                marketing: "Marketing",
                qrcode: "QR Code"
            },
            general: {
                title: "Restaurant Profile",
                desc: "This information is visible on your home page.",
                name: "Restaurant Name",
                namePlaceholder: "e.g. The Gourmet Kitchen",
                descLabel: "Description",
                descPlaceholder: "Brief tagline or description",
                slug: "Restaurant ID (Slug)",
                slugPlaceholder: "e.g. my-restaurant-name",
                slugHint: "This defines your unique website link. Use lowercase letters, numbers, and dashes only.",
                currency: "Currency Settings",
                currencyHint: "Select the currency for your menu prices and reports."
            },
            branding: {
                colorsTitle: "Brand Colors",
                colorsDesc: "Customize the look and feel of your digital menu.",
                primary: "Primary Action Color",
                secondary: "Secondary Accent",
                assetsTitle: "Visual Assets",
                assetsDesc: "Upload high-resolution images to showcase your brand.",
                logo: "Brand Logo",
                logoDesc: "Square PNG format recommended (512x512)",
                yourLogo: "Your Logo",
                yourLogoDesc: "This will appear on the top navigation bar of your digital menu and on QR codes. Use a transparent background for the best look.",
                optimized: "Optimized for Dark Mode",
                banner: "Hero Banner",
                bannerDesc: "Main background image for your landing page. (1920x1080 recommended)",
                bannerUploadDesc: "Drag and drop or click to upload a high-quality cover photo",
                replace: "Replace Asset",
                optimizing: "OPTIMIZING..."
            },
            contact: {
                hoursTitle: "Operating Hours",
                hoursDesc: "Set your restaurant's daily opening and closing times.",
                opening: "Opening Time",
                closing: "Closing Time",
                infoTitle: "Contact Information",
                infoDesc: "Help customers find and reach you.",
                phone: "Phone Number",
                email: "Public Email",
                address: "Physical Address",
                socialTitle: "Social Media",
                socialDesc: "Link your social profiles to your digital menu.",
                instagram: "Instagram URL",
                facebook: "Facebook URL",
                website: "Website URL"
            },
            marketing: {
                title: "Marketing & SEO",
                desc: "Optimize your restaurant's presence on search engines and share your story.",
                seoTitle: "SEO Meta Title",
                seoTitlePlaceholder: "e.g. Best Italian Pizza in Town | The Gourmet Kitchen",
                seoTitleHint: "Appears in Google search and browser tabs.",
                seoDesc: "SEO Meta Description",
                seoDescPlaceholder: "Describe your restaurant for search engines...",
                story: "Brand Story (Why Us?)",
                storyPlaceholder: "Tell your customers about your history, philosophy, or secret recipes...",
                storyHint: "This will be showcased on your public landing page."
            },
            qrcode: {
                title: "Table QR Code",
                desc: "Print this for your customers to scan and order.",
                print: "Print PDF",
                view: "View Live Site"
            }
        }
    },
    ar: {
        welcome: {
            secureAccess: "دخول شراكة آمن",
            enterDashboard: "دخول لوحة التحكم"
        },
        sidebar: {
            overview: "نظرة عامة",
            orders: "الطلبات",
            clients: "العملاء",
            menu: "إدارة القائمة",
            chatbot: "بوت واتساب",
            delivery: "توصيل R+‎",
            integrations: "التكاملات",
            settings: "الإعدادات",
            messages: "رسائل R+‎",
            dashboard: "لوحة التحكم",
            management: "الإدارة",
            admin: "المسؤول",
            adminConsole: "لوحة المسؤول",
            contactSupport: "دعم R+‎",
            logout: "تسجيل الخروج",
            visitWebsite: "زيارة مطعمنا",
            new: "جديد",
            soon: "قريباً",
            pro: "برو"
        },
        overview: {
            viewActiveOrders: "عرض الطلبات النشطة",
            editMenu: "تعديل القائمة",
            totalRevenue: "إجمالي الإيرادات",
            allTimeEarnings: "الأرباح الكلية",
            todaysRevenue: "إيرادات اليوم",
            performanceToday: "أداء اليوم",
            activeOrders: "الطلبات النشطة",
            ordersInKitchen: "طلبات في المطبخ",
            pendingIncome: "الدخل (المعلق)",
            unpaidOrders: "طلبات غير مدفوعة",
            totalOrders: "إجمالي الطلبات",
            allTimeOrders: "الطلبات الكلية",
            dailyOrders: "طلبات اليوم",
            ordersToday: "طلبات اليوم",
            popularItems: "الأصناف الأكثر طلباً",
            noSalesData: "لا توجد بيانات مبيعات بعد",
            viewFullMenu: "عرض أداء القائمة",
            recentActivity: "النشاط الأخير",
            refresh: "تحديث النظرة العامة",
            refreshing: "جاري التحديث..."
        },
        charts: {
            weekly: "أسبوعي",
            monthly: "شهري",
            yearly: "سنوي",
            totalGrowth: "إجمالي النمو",
            revenue: "الإيرادات"
        },
        calendar: {
            profitCalendar: "تقويم الأرباح",
            orders: "طلبات",
            dailyProfit: "الربح اليومي"
        },
        ordersPage: {
            title: "عرض المطبخ",
            subtitle: "إدارة الطلبات الحالية وحالة التحضير.",
            status: {
                open: "مفتوح للطلبات",
                closed: "مغلق",
                openMsg: "المطعم الآن مفتوح لتلقي الطلبات",
                closedMsg: "المطعم الآن مغلق أمام الطلبات",
                label: "حالة الطلبات",
                error: "فشل تحديث الحالة"
            },
            metrics: {
                responseTime: "وقت الاستجابة",
                placedToPreparing: "من الطلب للتحضير",
                cookTime: "وقت الطهي",
                preparingToReady: "من التحضير للجاهزية",
                serviceSpeed: "سرعة الخدمة",
                readyToServed: "من الجاهزية للتقديم",
                totalDineIn: "إجمالي المحلي",
                totalTakeAway: "إجمالي السفري",
                min: "دقيقة"
            },
            board: {
                new: "طلبات جديدة",
                preparing: "قيد التحضير",
                ready: "جاهز",
                served: "تم التقديم",
                columns: {
                    new: "جديد",
                    preparing: "تحضير",
                    ready: "جاهز",
                    served: "تم التقديم"
                },
                noOrders: "لا توجد طلبات نشطة",
                table: "طاولة",
                takeaway: "سفري",
                item: "صنف",
                note: "ملاحظة",
                actions: {
                    markPreparing: "بدء التحضير",
                    markReady: "جاهز للتقديم",
                    markServed: "تم التقديم",
                    markPaid: "تم الدفع",
                    cancel: "إلغاء الطلب"
                }
            }
        },
        menuPage: {
            title: "إدارة القائمة",
            subtitle: "قم بإدارة مجموعتك الطهوية",
            itemsCount: "عنصر",
            searchPlaceholder: "ابحث في القائمة...",
            categories: "الفئات",
            newItem: "عنصر جديد",
            noItems: {
                title: "لم يتم العثور على عناصر",
                desc: "جرب تعديل البحث أو أضف عنصراً جديداً إلى قائمتك."
            },
            dialog: {
                editTitle: "تعديل العنصر",
                newTitle: "عنصر جديد",
                labels: {
                    name: "اسم العنصر",
                    namePlaceholder: "مثال: برجر ترافل مشروم",
                    price: "السعر",
                    status: "الحالة",
                    category: "الفئة",
                    description: "الوصف",
                    descPlaceholder: "صف المكونات، الطعم، والقصة...",
                    image: "الصورة",
                    chooseImage: "اختر ملف صورة...",
                    pasteUrl: "الصق رابط الصورة..."
                },
                status: {
                    available: "متاح (نشط)",
                    soldOut: "نفذت الكمية (مرئي لكن لا يمكن طلبه)",
                    hidden: "مخفي (غير مرئي)"
                },
                categories: {
                    select: "اختر الفئة...",
                    new: "+ فئة جديدة",
                    placeholder: "اسم الفئة",
                    manageTitle: "إدارة الفئات",
                    noCategories: "لا توجد فئات بعد."
                },
                variants: {
                    groupName: "مجموعة خيارات جديدة (مثال: الحجم، الصوص)",
                    groupPlaceholder: "اسم المجموعة",
                    noVariants: "لا توجد خيارات مخصصة بعد.",
                    addDesc: 'أضف "صوصات"، "أحجام"، أو "إضافات" أعلاه.',
                    selectionType: "نوع الاختيار",
                    full: "مطلوب؟",
                    single: "فردي",
                    multi: "متعدد",
                    optionName: "اسم الخيار (مثال: جبنة إضافية)",
                    price: "السعر (+)",
                    add: "إضافة"
                },
                save: "حفظ العنصر",
                saving: "جاري الحفظ...",
            }
        },
        settingsPage: {
            title: "الإعدادات",
            subtitle: "إدارة ملف المطعم والمظهر والاتصال.",
            save: "حفظ التغييرات",
            tabs: {
                general: "عام",
                branding: "العلامة التجارية",
                contact: "الاتصال",
                marketing: "التسويق",
                qrcode: "QR كود"
            },
            general: {
                title: "ملف المطعم",
                desc: "هذه المعلومات مرئية على صفحتك الرئيسية.",
                name: "اسم المطعم",
                namePlaceholder: "مثال: المطبخ الذواقة",
                descLabel: "الوصف",
                descPlaceholder: "شعار مختصر أو وصف",
                slug: "معرف المطعم (الرابط)",
                slugPlaceholder: "مثال: my-restaurant-name",
                slugHint: "هذا يحدد رابط موقعك الفريد. استخدم أحرف صغيرة وأرقام وشرطات فقط.",
                currency: "إعدادات العملة",
                currencyHint: "اختر العملة لأسعار القائمة والتقارير."
            },
            branding: {
                colorsTitle: "ألوان العلامة التجارية",
                colorsDesc: "خصص مظهر وشعور قائمتك الرقمية.",
                primary: "لون الإجراء الأساسي",
                secondary: "اللون الثانوي",
                assetsTitle: "الأصول المرئية",
                assetsDesc: "ارفع صور عالية الدقة لعرض علامتك التجارية.",
                logo: "شعار العلامة التجارية",
                logoDesc: "يفضل تنسيق PNG مربع (512x512)",
                yourLogo: "شعارك",
                yourLogoDesc: "سيظهر هذا في شريط التنقل العلوي وعلى رموز QR. استخدم خلفية شفافة للحصول على أفضل مظهر.",
                optimized: "محسّن للوضع الليلي",
                banner: "بانر الصفحة الرئيسية",
                bannerDesc: "صورة الخلفية الرئيسية لصفحة الهبوط. (يفضل 1920x1080)",
                bannerUploadDesc: "اسحب وأفلت أو انقر لرفع صورة غلاف عالية الجودة",
                replace: "استبدال الأصل",
                optimizing: "جاري التحسين..."
            },
            contact: {
                hoursTitle: "ساعات العمل",
                hoursDesc: "حدد أوقات الفتح والإغلاق اليومية.",
                opening: "وقت الفتح",
                closing: "وقت الإغلاق",
                infoTitle: "معلومات الاتصال",
                infoDesc: "ساعد العملاء في العثور عليك والوصول إليك.",
                phone: "رقم الهاتف",
                email: "البريد الإلكتروني العام",
                address: "العنوان الفعلي",
                socialTitle: "وسائل التواصل الاجتماعي",
                socialDesc: "اربط حساباتك الاجتماعية بقائمتك الرقمية.",
                instagram: "رابط انستغرام",
                facebook: "رابط فيسبوك",
                website: "رابط الموقع الإلكتروني"
            },
            marketing: {
                title: "التسويق و SEO",
                desc: "حسّن ظهور مطعمك على محركات البحث وشارك قصتك.",
                seoTitle: "عنوان Meta SEO",
                seoTitlePlaceholder: "مثال: أفضل بيتزا إيطالية في المدينة | المطبخ الذواقة",
                seoTitleHint: "يظهر في بحث Google وعلامات تبويب المتصفح.",
                seoDesc: "وصف Meta SEO",
                seoDescPlaceholder: "صف مطعمك لمحركات البحث...",
                story: "قصة العلامة التجارية (لماذا نحن؟)",
                storyPlaceholder: "أخبر عملاءك عن تاريخك، فلسفتك، أو وصفاتك السرية...",
                storyHint: "سيتم عرض هذا على صفحة الهبوط العامة."
            },
            qrcode: {
                title: "QR كود الطاولة",
                desc: "اطبع هذا لعملائك للمسح والطلب.",
                print: "طباعة PDF",
                view: "عرض الموقع الحي"
            }
        }
    }
};
