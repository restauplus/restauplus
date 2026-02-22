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
        },
        landing: {
            navbar: {
                pricing: "Pricing",
                contact: "Contact Us",
                login: "Login",
                signup: "Sign Up"
            },
            dashboardDemo: {
                badge: "The Future is Here",
                titleLine1: "All-in-one tech platform",
                titleLine2: "for",
                titleLineHighlight: "Restaurants",
                description: "Replace 5 fragmented tools with one powerful operating system. Built for speed, designed for scale.",
                startTrial: "Start Free Trial",
                watchDemo: "Watch Demo",
                scaled: "Restaurants Scaled",
                rating: "Customer Rating"
            },
            ecosystemStrip: {
                pos: "Point of Sale (POS)",
                website: "Branded Website and App",
                ordering: "Online Ordering",
                integrations: "Integrations",
                qr: "QR Code Table Ordering",
                reservations: "Table Reservations",
                loyalty: "Loyalty Program"
            },
            features: {
                badge: "Not Just A Menu",
                titleLine1: "More Than Just a",
                titleLine2: "Digital Ecosystem",
                descriptionLine1: "RESTAU PLUS reconstructs your entire operation into a single, seamless flow.",
                descriptionLine2: "From the first scan to the final profit analysis.",
                items: {
                    qr: {
                        title: "Instant QR Ordering",
                        desc: "Scan, order, and pay. No apps to download. Pure speed that delights customers."
                    },
                    upsell: {
                        title: "Smart Upselling",
                        desc: "AI-powered recommendations that boost check size by 20%."
                    },
                    kds: {
                        title: "Kitchen Display",
                        desc: "Real-time order syncing directly to your kitchen. Eliminate errors."
                    },
                    analytics: {
                        title: "Real-time Analytics",
                        desc: "Watch your revenue grow in real-time. Make decisions based on data, not guesses."
                    },
                    staff: {
                        title: "Staff Management",
                        desc: "Track performance, manage shifts, and optimize your team's efficiency."
                    }
                }
            },
            rplusMarketing: {
                badge: "R+ Marketing For Restaurants",
                titleLine1: "Turn Walk-ins Into",
                titleLine2: "Lifelong Loyal Clients",
                description: "Stop guessing. Start knowing. We seamlessly collect your customers' data and empower you to retarget them with irresistible offers to secure their return.",
                steps: {
                    s1: {
                        title: "1. Effortless Data Collection",
                        desc: "Every time a customer interacts with your digital menu or places an order, their profile is automatically built within your database."
                    },
                    s2: {
                        title: "2. Precision Retargeting",
                        desc: "Launch targeted SMS and Email campaigns. Send VIP discounts or 'We Miss You' offers directly to their phones."
                    },
                    s3: {
                        title: "3. Skyrocket Conversions",
                        desc: "Watch your return rate multiply. Secure their loyalty and turn occasional diners into regular brand advocates."
                    }
                },
                dashboard: {
                    title: "Campaign Manager",
                    activeFlow: "Active Retargeting Flow",
                    active: "Active",
                    sendingOffer: "Sending 20% Offer...",
                    offerRedeemed: "Offer Redeemed",
                    vipStatus: "VIP Status Unlocked",
                    newProfiles: "New Profiles Captured",
                    thisMonth: "This Month",
                    returnRate: "Return Rate Increased",
                    fromRetargeting: "From Retargeting"
                }
            },
            hotelRoomService: {
                badge: "Beyond Restaurants",
                titleLine1: "Elevate Your",
                titleLine2: "Hotel Room Service",
                description: "Guests can order perfectly crafted meals directly from their rooms without calling down. Instant dashboard notifications mean faster service and happier guests.",
                steps: {
                    scan: {
                        title: "1. Scan In-Room QR",
                        desc: "Unique QR codes placed in every room. Guests scan to instantly access your customized room service menu.",
                        mockupRoom: "Room 402"
                    },
                    order: {
                        title: "2. Browse & Order",
                        desc: "Guests browse the rich visual menu and place orders directly from their personal devices comfortably.",
                        mockupTitle: "In-Room Dining",
                        mockupButton: "PLACE ORDER"
                    },
                    notify: {
                        title: "3. Instant Notification",
                        desc: "The restaurant dashboard instantly rings with a notification, precisely detailing the room number for quick delivery.",
                        mockupNewOrder: "New Order!",
                        mockupTime: "JUST NOW",
                        mockupRoom: "ROOM 402"
                    }
                }
            },
            pricing: {
                badge: "R+ restaurants offer",
                titleLine1: "Choose Your",
                titleLine2: "Path to Dominance",
                monthly: {
                    title: "Monthly Pro",
                    price: "499 QAR",
                    period: "/mo",
                    was: "was 800 QAR",
                    features: [
                        "Real-time Dashboard",
                        "Unlimited QR Scans",
                        "Inventory & Stock",
                        "Staff Management",
                        "Standard Support"
                    ],
                    button: "Select Monthly"
                },
                trial: {
                    popularBadge: "Most Popular Choice",
                    title: "Founders Launch",
                    price: "FREE",
                    period: "For 10 Days",
                    quote: "\"Experience the full power of Restau Plus Pro with absolutely zero risk.\"",
                    features: [
                        "Access to ALL Pro Features",
                        "Priority Onboarding Setup",
                        "No Credit Card Required",
                        "Valid for First 10 Restaurants",
                        "Cancel Anytime"
                    ],
                    button: "Start Free Trial",
                    spotsRemaining: "Only 3 Spots Remaining"
                },
                yearly: {
                    title: "Yearly Elite Pro",
                    price: "4850 QAR",
                    period: "/yr",
                    bestValue: "~404 QAR/mo (Best Value)",
                    features: [
                        "Everything in Monthly",
                        "Pro camera 4k video marketing",
                        "Locked-in Discount Rate",
                        "Dedicated Account Manager",
                        "Advanced Analytics Suite",
                        "Custom Branding Options",
                        "Save 1138 QAR Yearly"
                    ],
                    button: "Go Elite Yearly"
                },
                badges: {
                    secure: "Secure Payment",
                    instant: "Instant Activation",
                    cancel: "Cancel Anytime",
                    support: "24/7 Priority Support"
                }
            },
            hotelPricing: {
                badge: "R+ Hotels Offer",
                titleLine1: "Scale Your",
                titleLine2: "Hospitality Experience",
                monthly: {
                    title: "Hotel Monthly",
                    price: "1150 QAR",
                    period: "/mo",
                    features: [
                        "Real-time Dashboard",
                        "Unlimited Room QR Scans",
                        "Inventory & Stock",
                        "Staff Management",
                        "Restau Plus support 16h/day 7/7"
                    ],
                    button: "Select Monthly"
                },
                sixMonths: {
                    popularBadge: "Premium Hospitality",
                    title: "Hotel 6 Months",
                    price: "5500 QAR",
                    period: "/6mo",
                    was: "was 6,900 QAR",
                    quote: "\"Perfect balance of premium features and flexibility for your hotel.\"",
                    features: [
                        "Everything in Hotel Monthly",
                        "Priority Onboarding Setup",
                        "Advanced Room Analytics",
                        "Save 1,400 QAR"
                    ],
                    button: "Select 6 Months",
                    availability: "Limited Availability"
                },
                yearly: {
                    title: "Hotel Elite Yearly",
                    price: "9700 QAR",
                    period: "/yr",
                    was: "was 13,800 QAR",
                    bestValue: "~808 QAR/mo (Best Value)",
                    features: [
                        "Everything in Hotel Monthly",
                        "Pro camera 4k video marketing",
                        "Locked-in Discount Rate",
                        "Dedicated Account Manager",
                        "Advanced Room Analytics",
                        "Custom Branding Options",
                        "Save 4,100 QAR Yearly"
                    ],
                    button: "Go Hotel Elite Yearly"
                }
            },
            footer: {
                links: {
                    pricing: "Pricing",
                    about: "About",
                    contact: "Contact"
                },
                rights: "Restau Plus. All rights reserved.",
                privacy: "Privacy Policy",
                terms: "Terms of Service"
            },
            about: {
                founderRole: "Founder & CEO",
                visionaryBadge: "Visionary Leadership",
                titleLine1: "Built for Visionaries,",
                titleLine2: "by a Visionary.",
                desc1: "\"I founded Restau+ with a singular obsession: to eliminate the friction that holds restaurant owners back. The hospitality industry was stuck in the past, relying on fragmented tools that didn't talk to each other.\"",
                desc2: "\"We didn't just want to build software; we wanted to build an engine for growth. Restau+ is the realization of that vision—a platform where technology disappears, and only performance remains.\"",
                innovationBadge: "Rapid Innovation",
                enterpriseBadge: "Enterprise Grade"
            },
            contact: {
                badge: "We're here to help",
                titleLine1: "Let's Talk",
                titleLine2: "Business",
                description: "Have a question about our pricing, features, or need a custom solution? Our team is ready to answer all your questions.",
                instantSupport: {
                    title: "Instant Support",
                    desc: "Chat directly with our sales team on WhatsApp for the fastest response.",
                    button: "Chat on WhatsApp",
                    online: "Online Now (+974 5170 4550)"
                },
                otherWays: {
                    title: "Other ways to reach us",
                    emailSupport: "Email Support",
                    hq: "Global HQ"
                },
                form: {
                    title: "Send us a message",
                    nameLabel: "Name",
                    namePlaceholder: "John Doe",
                    restaurantLabel: "Restaurant Name",
                    restaurantPlaceholder: "Burger Co.",
                    emailLabel: "Email",
                    messageLabel: "Message",
                    messagePlaceholder: "Tell us about your restaurant...",
                    button: "Send Message"
                }
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
        },
        landing: {
            navbar: {
                pricing: "خطط الأسعار",
                contact: "اتصل بنا",
                login: "تسجيل الدخول",
                signup: "إنشاء حساب"
            },
            dashboardDemo: {
                badge: "المستقبل هنا",
                titleLine1: "منصة التكنولوجيا المتكاملة",
                titleLine2: "برنامج",
                titleLineHighlight: "للمطاعم",
                description: "استبدل 5 أدوات متفرقة بنظام تشغيل واحد قوي. مصمم للسرعة، مهيأ للتوسع.",
                startTrial: "ابدأ تجربتك المجانية",
                watchDemo: "شاهد العرض",
                scaled: "مطعم تم توسيعه",
                rating: "تقييم العملاء"
            },
            ecosystemStrip: {
                pos: "نقاط البيع (POS)",
                website: "موقع إلكتروني وتطبيق",
                ordering: "الطلب عبر الإنترنت",
                integrations: "تكاملات للنظام",
                qr: "الطلب عبر QR",
                reservations: "حجوزات الطاولات",
                loyalty: "برنامج الولاء"
            },
            features: {
                badge: "ليس مجرد قائمة",
                titleLine1: "أكثر من مجرد",
                titleLine2: "نظام بيئي رقمي",
                descriptionLine1: "برنامج RESTAU PLUS يعيد بناء عملياتك بالكامل في تدفق واحد سلس.",
                descriptionLine2: "من المسح الأول إلى تحليل الأرباح النهائي.",
                items: {
                    qr: {
                        title: "الطلب الفوري عبر QR",
                        desc: "امسح، اطلب، وادفع. بدون تطبيقات للتحميل. سرعة خالصة تسعد العملاء."
                    },
                    upsell: {
                        title: "البيع المتقاطع الذكي",
                        desc: "توصيات مدعومة بالذكاء الاصطناعي تزيد من متوسط فاتورتك بنسبة 20٪."
                    },
                    kds: {
                        title: "شاشة المطبخ (KDS)",
                        desc: "مزامنة الطلبات في الوقت الفعلي مباشرة إلى مطبخك. تخلص من الأخطاء."
                    },
                    analytics: {
                        title: "تحليلات الأرباح المبكرة",
                        desc: "شاهد إيراداتك تنمو في الوقت الفعلي. اتخذ قرارات بناءً على البيانات، وليس التخمينات."
                    },
                    staff: {
                        title: "إدارة الموظفين",
                        desc: "تتبع الأداء، قم بإدارة المناوبات، وحسِّن كفاءة فريقك."
                    }
                }
            },
            rplusMarketing: {
                badge: "تسويق R+ للمطاعم",
                titleLine1: "حوّل الزوار العابرين إلى",
                titleLine2: "عملاء دائمين مدى الحياة",
                description: "توقف عن التخمين وابدأ باليقين. نقوم بجمع بيانات عملائك بسلاسة ونمكنك من إعادة استهدافهم بعروض لا تُقاوم لضمان عودتهم.",
                steps: {
                    s1: {
                        title: "١. جمع بيانات بسهولة",
                        desc: "في كل مرة يتفاعل فيها عميل مع قائمتك الرقمية أو يضع طلبًا، يتم بناء ملفه الشخصي تلقائيًا في قاعدة بياناتك."
                    },
                    s2: {
                        title: "٢. الاستهداف الدقيق",
                        desc: "أطلق حملات رسائل قصيرة وبريد إلكتروني مستهدفة. أرسل خصومات VIP أو عروض 'افتقدناك' مباشرة إلى هواتفهم."
                    },
                    s3: {
                        title: "٣. رفع معدلات التحويل",
                        desc: "شاهد معدل عودتهم يتضاعف. اضمن ولاءهم وحوّلهم من زوار عرضيين إلى داعمين دائمين لعلامتك التجارية."
                    }
                },
                dashboard: {
                    title: "مدير الحملات التسويقية",
                    activeFlow: "تدفق الاستهداف النشط",
                    active: "نشط",
                    sendingOffer: "جاري إرسال عرض 20٪...",
                    offerRedeemed: "تم استخدام العرض",
                    vipStatus: "تم فتح حالة VIP",
                    newProfiles: "ملفات جديدة تم التقاطها",
                    thisMonth: "هذا الشهر",
                    returnRate: "زيادة معدل العودة",
                    fromRetargeting: "من إعادة الاستهداف"
                }
            },
            hotelRoomService: {
                badge: "ما بعد المطاعم",
                titleLine1: "ارتقِ بخدمة",
                titleLine2: "غرف الفندق",
                description: "يمكن للضيوف طلب وجبات مُعدة بامتياز مباشرة من غرفهم دون الحاجة للاتصال. إشعارات لوحة التحكم الفورية تعني خدمة أسرع وضيوفًا أكثر سعادة.",
                steps: {
                    scan: {
                        title: "١. مسح QR في الغرفة",
                        desc: "رموز QR فريدة موضوعة في كل غرفة. يقوم الضيوف بالمسح للوصول الفوري إلى قائمة خدمة الغرف المخصصة.",
                        mockupRoom: "غرفة ٤٠٢"
                    },
                    order: {
                        title: "٢. تصفح واطلب",
                        desc: "يتصفح الضيوف القائمة المرئية الغنية ويقدمون طلباتهم مباشرة من أجهزتهم الشخصية بكل راحة.",
                        mockupTitle: "تناول الطعام في الغرفة",
                        mockupButton: "قدم الطلب"
                    },
                    notify: {
                        title: "٣. إشعار فوري",
                        desc: "ترن لوحة تحكم المطعم فورًا بإشعار، موضحة بدقة رقم الغرفة لتوصيل سريع.",
                        mockupNewOrder: "طلب جديد!",
                        mockupTime: "الآن",
                        mockupRoom: "غرفة ٤٠٢"
                    }
                }
            },
            pricing: {
                badge: "عرض مطاعم R+",
                titleLine1: "اختر مسارك",
                titleLine2: "نحو السيطرة",
                monthly: {
                    title: "الاشتراك الشهري الاحترافي",
                    price: "٤٩٩ ريال قطري",
                    period: "/شهرياً",
                    was: "كان ٨٠٠ ريال قطري",
                    features: [
                        "لوحة تحكم في الوقت الفعلي",
                        "مسح QR غير محدود",
                        "المخزون والمستودع",
                        "إدارة الموظفين",
                        "دعم قياسي"
                    ],
                    button: "اختر الشهري"
                },
                trial: {
                    popularBadge: "الخيار الأكثر شعبية",
                    title: "إطلاق المؤسسين",
                    price: "مجاناً",
                    period: "لمدة ١٠ أيام",
                    quote: "\"جرب القوة الكاملة لبرنامج RESTAU PLUS دون أي مخاطرة تقريبًا.\"",
                    features: [
                        "الوصول إلى جميع الميزات الاحترافية",
                        "إعداد أولوية التهيئة",
                        "لا يشترط بطاقة ائتمان",
                        "صالح لأول ١٠ مطاعم",
                        "إلغاء في أي وقت"
                    ],
                    button: "ابدأ التجربة المجانية",
                    spotsRemaining: "باقي ٣ أماكن فقط"
                },
                yearly: {
                    title: "السنوي النخبة الاحترافي",
                    price: "٤٨٥٠ ريال قطري",
                    period: "/سنوياً",
                    bestValue: "~٤٠٤ ريال قطري/شهرياً (أفضل قيمة)",
                    features: [
                        "كل شيء في الشهري",
                        "تسويق تصوير فيديو احترافي كاميرا 4k",
                        "تثبيت معدل الخصم",
                        "مدير حساب مخصص",
                        "حزمة تحليلات متقدمة",
                        "خيارات تخصيص العلامة التجارية",
                        "توفير ١١٣٨ ريال قطري سنوياً"
                    ],
                    button: "احصل على السنوي"
                },
                badges: {
                    secure: "دفع آمن",
                    instant: "تفعيل فوري",
                    cancel: "إلغاء في أي وقت",
                    support: "دعم على مدار الساعة ٢٤/٧"
                }
            },
            hotelPricing: {
                badge: "عرض فنادق R+",
                titleLine1: "ارتقِ",
                titleLine2: "بتجربة الضيافة",
                monthly: {
                    title: "الاشتراك الشهري للفنادق",
                    price: "١١٥٠ ريال قطري",
                    period: "/شهرياً",
                    features: [
                        "لوحة تحكم في الوقت الفعلي",
                        "مسح QR للغرف غير محدود",
                        "المخزون والمستودع",
                        "إدارة الموظفين",
                        "دعم RESTAU PLUS ١٦ ساعة/يوم ٧/٧"
                    ],
                    button: "اختر الشهري"
                },
                sixMonths: {
                    popularBadge: "ضيافة فاخرة",
                    title: "اشتراك ٦ أشهر للفنادق",
                    price: "٥٥٠٠ ريال قطري",
                    period: "/٦أشهر",
                    was: "كان ٦٩٠٠ ريال قطري",
                    quote: "\"توازن مثالي بين الميزات المتميزة والمرونة لفندقك.\"",
                    features: [
                        "كل شيء في الخطة الشهرية للفنادق",
                        "إعداد أولوية التهيئة",
                        "تحليلات متقدمة للغرف",
                        "توفير ١٤٠٠ ريال قطري"
                    ],
                    button: "اختر ٦ أشهر",
                    availability: "التوفر محدود"
                },
                yearly: {
                    title: "سنوي النخبة للفنادق",
                    price: "٩٧٠٠ ريال قطري",
                    period: "/سنوياً",
                    was: "كان ١٣٨٠٠ ريال قطري",
                    bestValue: "~٨٠٨ ريال قطري/شهرياً (أفضل قيمة)",
                    features: [
                        "كل شيء في الخطة الشهرية للفنادق",
                        "تسويق تصوير فيديو احترافي كاميرا 4k",
                        "تثبيت معدل الخصم",
                        "مدير حساب مخصص",
                        "تحليلات متقدمة للغرف",
                        "خيارات تخصيص العلامة التجارية",
                        "توفير ٤١٠٠ ريال قطري سنوياً"
                    ],
                    button: "احصل على السنوي"
                }
            },
            footer: {
                links: {
                    pricing: "الأسعار",
                    about: "من نحن",
                    contact: "اتصل بنا"
                },
                rights: "Restau Plus. جميع الحقوق محفوظة.",
                privacy: "سياسة الخصوصية",
                terms: "شروط الخدمة"
            },
            about: {
                founderRole: "المؤسس والمدير التنفيذي",
                visionaryBadge: "قيادة ذات رؤية",
                titleLine1: "مبني لأصحاب الرؤى،",
                titleLine2: "بواسطة صاحب رؤية.",
                desc1: "\"أسست Restau+ بشغف فريد: إزالة العقبات التي تعيق تقدم أصحاب المطاعم. كانت صناعة الضيافة عالقة في الماضي، وتعتمد على أدوات مجزأة لا تتواصل مع بعضها البعض.\"",
                desc2: "\"لم نكن نريد مجرد بناء برنامج؛ أردنا بناء محرك للنمو. Restau+ هو تحقيق لتلك الرؤية - منصة حيث تختفي التكنولوجيا، ويبقى الأداء فقط.\"",
                innovationBadge: "ابتكار سريع",
                enterpriseBadge: "مستوى المؤسسات"
            },
            contact: {
                badge: "نحن هنا للمساعدة",
                titleLine1: "دعونا نتحدث",
                titleLine2: "في الأعمال",
                description: "هل لديك سؤال بخصوص أسعارنا أو ميزاتنا أو هل تحتاج إلى حل مخصص؟ فريقنا مستعد للإجابة على جميع أسئلتك.",
                instantSupport: {
                    title: "دعم فوري",
                    desc: "تحدث مباشرة مع فريق المبيعات لدينا على واتساب للحصول على أسرع استجابة.",
                    button: "تحدث على واتساب",
                    online: "متاح الآن (+974 5170 4550)"
                },
                otherWays: {
                    title: "طرق أخرى للتواصل معنا",
                    emailSupport: "دعم عبر البريد الإلكتروني",
                    hq: "المقر الرئيسي العالمي"
                },
                form: {
                    title: "أرسل لنا رسالة",
                    nameLabel: "الاسم",
                    namePlaceholder: "محمد عبد الله",
                    restaurantLabel: "اسم المطعم",
                    restaurantPlaceholder: "برجر كو",
                    emailLabel: "البريد الإلكتروني",
                    messageLabel: "الرسالة",
                    messagePlaceholder: "أخبرنا عن مطعمك...",
                    button: "أرسل الرسالة"
                }
            }
        }
    }
};
