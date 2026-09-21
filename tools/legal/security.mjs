/**
 * «الأمان والامتثال» — the content of security.html, in both languages.
 *
 * The frameworks named here were checked against the primary sources:
 *   - NCA: Essential Cybersecurity Controls (ECC 2-2024), Cloud Cybersecurity
 *     Controls (CCC 2-2024, updated for data-localisation requirements), and
 *     Data Cybersecurity Controls (DCC-1:2022)
 *   - SDAIA: نظام حماية البيانات الشخصية ولائحته التنفيذية، ولائحة نقل البيانات
 *   - CST: الإطار التنظيمي لخدمات الحوسبة السحابية
 *
 * Everything described as a control we run is a commitment the site makes in its
 * own name. Nothing here claims a certificate or an accreditation.
 */
const t = (ar, en) => ({ ar, en });

export default {
  slug: "security",
  key: "lg.security",
  updated: t("21 سبتمبر 2026", "21 September 2026"),
  version: "1.0",
  title: t("الأمان والامتثال", "Security and compliance"),
  eyebrow: t("الوثائق القانونية", "Legal documents"),
  lede: t(
    "الضوابط التي نُشغّل بها المنصّة، والأطر الوطنية التي نبني عليها، وما نستطيع أن نوثّقه لجهة تراجع الخدمة قبل الاعتماد عليها.",
    "The controls the platform runs on, the national frameworks we build against, and what we can put in writing for an entity assessing the service.",
  ),
  desc: t(
    "الأمن والامتثال في «جداول»: التشفير وإدارة الوصول والنسخ الاحتياطي والاستجابة للحوادث، ومواءمة الأطر الوطنية للأمن السيبراني وحماية البيانات في المملكة.",
    "Security and compliance at Jadawel: encryption, access management, backups and incident response, aligned with Saudi Arabia's cybersecurity and data protection frameworks.",
  ),
  sections: [
    {
      id: "approach",
      title: t("منهجيتنا", "Our approach"),
      blocks: [
        {
          p: t(
            "نبني أمن المنصّة على ثلاث طبقات: ضوابط تقنية مطبَّقة في التصميم والتشغيل، وإجراءات تنظيمية موثّقة تحكم من يفعل ماذا ومتى، وأدلة يمكن مراجعتها مع الجهة قبل التعاقد وبعده. وهدفنا أن يكون كل ما نقوله هنا قابلًا للتحقّق، لا وعدًا في صفحة تسويقية.",
            "Platform security rests on three layers for us: technical controls built into the design and the running of the service, documented procedures that decide who does what and when, and evidence that an entity can review with us before and after contracting. The aim is that everything stated here is verifiable, not a marketing promise.",
          ),
        },
        {
          ul: [
            t(
              "الحدّ الأدنى الذي نطبّقه مستمدّ من الضوابط الوطنية للأمن السيبراني في المملكة، لا من قائمة عامة.",
              "The baseline we apply comes from the Kingdom's national cybersecurity controls, not from a generic checklist.",
            ),
            t(
              "البيانات الشخصية تُعالج على أساس نظام حماية البيانات الشخصية ولائحته التنفيذية، وما يتفرّع عنهما من لوائح.",
              "Personal data is processed under the Personal Data Protection Law, its Implementing Regulations, and the regulations that follow from them.",
            ),
            t(
              "البيانات لا تغادر المملكة في الخيار السحابي، وهذا مطلب نتعامل معه كقيد تصميمي لا كخيار تشغيلي.",
              "In the cloud offering, data does not leave the Kingdom, and we treat that as a design constraint rather than an operational preference.",
            ),
            t(
              "لا نُعلن في هذه الصفحة شهادة أو اعتمادًا لم يصدر لنا، وما نستطيع تسليمه كتابيًا مذكور في قسم الوثائق المتاحة.",
              "This page claims no certificate or accreditation we do not hold; what we can hand over in writing is listed under the documents we provide.",
            ),
          ],
        },
      ],
    },
    {
      id: "frameworks",
      title: t("الأطر التي نبني عليها", "The frameworks we build against"),
      blocks: [
        {
          p: t(
            "هذه هي الوثائق المرجعية التي تُقاس عليها ممارساتنا، وأين تمسّ خدمتنا تحديدًا:",
            "These are the reference documents our practices are measured against, and where each one touches our service:",
          ),
        },
        {
          table: {
            caption: t("الأطر المرجعية", "Reference frameworks"),
            head: [t("الإطار", "Framework"), t("الجهة", "Issuer"), t("موقعه من خدمتنا", "How it applies to us")],
            rows: [
              [
                t("الضوابط الأساسية للأمن السيبراني (ECC 2-2024)", "Essential Cybersecurity Controls (ECC 2-2024)"),
                t("الهيئة الوطنية للأمن السيبراني", "National Cybersecurity Authority"),
                t(
                  "الحدّ الأدنى لضوابط الأمن السيبراني في الجهات الوطنية، وهو الأساس الذي بُنيت عليه ضوابط التشغيل والوصول والتشفير والاستجابة للحوادث في المنصّة.",
                  "The minimum cybersecurity baseline for national entities, and the basis for the operating, access, encryption, and incident response controls in the platform.",
                ),
              ],
              [
                t("ضوابط الأمن السيبراني للحوسبة السحابية (CCC 2-2024)", "Cloud Cybersecurity Controls (CCC 2-2024)"),
                t("الهيئة الوطنية للأمن السيبراني", "National Cybersecurity Authority"),
                t(
                  "ضوابط ممتدّة من الضوابط الأساسية تخصّ مزوّدي الخدمات السحابية ومستأجريها، وتتضمّن متطلبات تحديد موقع البيانات؛ وهي المرجع المباشر لالتزامنا باستضافة البيانات داخل المملكة.",
                  "An extension of the essential controls aimed at cloud service providers and tenants, including data-location requirements; it is the direct reference for keeping data hosted inside the Kingdom.",
                ),
              ],
              [
                t("ضوابط الأمن السيبراني للبيانات (DCC-1:2022)", "Data Cybersecurity Controls (DCC-1:2022)"),
                t("الهيئة الوطنية للأمن السيبراني", "National Cybersecurity Authority"),
                t(
                  "حماية البيانات في دورة حياتها كاملة من الإنشاء إلى الإتلاف، وهي مرجع تصنيف البيانات وتقليلها وضبط الوصول إليها.",
                  "Protecting data across its whole lifecycle, from creation to destruction, and the reference for classifying, minimising, and restricting access to it.",
                ),
              ],
              [
                t("نظام الأمن السيبراني ولائحته التنفيذية", "The Cybersecurity Law and its Implementing Regulation"),
                t("الهيئة الوطنية للأمن السيبراني", "National Cybersecurity Authority"),
                t(
                  "الإطار النظامي الذي يوجب حماية الشبكات والأنظمة والبيانات، والالتزام بالضوابط الصادرة عن الهيئة والإبلاغ عن الحوادث.",
                  "The legal framework requiring protection of networks, systems, and data, compliance with the Authority's controls, and incident reporting.",
                ),
              ],
              [
                t("نظام حماية البيانات الشخصية ولائحته التنفيذية", "The Personal Data Protection Law and its Implementing Regulations"),
                t("الهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا)", "Saudi Data and Artificial Intelligence Authority (SDAIA)"),
                t(
                  "أساس معالجة البيانات الشخصية وحقوق أصحابها والإبلاغ عن التسرّب، إضافة إلى لائحة تنظيم نقل البيانات الشخصية خارج المملكة.",
                  "The basis for processing personal data, data-subject rights, and breach notification, alongside the regulations on transferring personal data outside the Kingdom.",
                ),
              ],
              [
                t("الإطار التنظيمي لخدمات الحوسبة السحابية", "The Cloud Computing Regulatory Framework"),
                t("هيئة الاتصالات والفضاء والتقنية", "Communications, Space and Technology Commission"),
                t(
                  "تنظيم تقديم خدمات الحوسبة السحابية في المملكة والتزامات مزوّد الخدمة تجاه العملاء، بما يشمل الشفافية في موقع البيانات.",
                  "Regulates providing cloud services in the Kingdom and a provider's duties toward customers, including transparency about where data is held.",
                ),
              ],
              [
                t("سياسات إدارة البيانات الوطنية", "National data governance policies"),
                t("الهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا)", "Saudi Data and Artificial Intelligence Authority (SDAIA)"),
                t(
                  "تصنيف البيانات والضوابط المرجعية لمشاركتها، ونطبّقها داخل بيئة التشغيل وفي علاقتنا بالموردين.",
                  "Data classification and the reference controls for sharing it, which we apply inside the operating environment and in our supplier relationships.",
                ),
              ],
            ],
          },
        },
      ],
    },
    {
      id: "encryption",
      title: t("التشفير وحماية البيانات", "Encryption and data protection"),
      blocks: [
        {
          ul: [
            t(
              "جميع الاتصالات بالموقع والمنصّة مشفّرة بمعيار TLS 1.3، ولا تُقبل جلسة غير مشفّرة، مع تشديد إعدادات المتصفّح والمنافذ.",
              "All traffic to the website and the platform is encrypted with TLS 1.3; an unencrypted session is refused, and browser and port settings are hardened.",
            ),
            t(
              "التخزين مشفّر بمعيار AES-256، بما يشمل قواعد البيانات والمرفقات والنسخ الاحتياطية.",
              "Storage is encrypted with AES-256, covering databases, attachments, and backups.",
            ),
            t(
              "المفاتيح تُدار بواسطة خدمة مخصّصة، ولا تُخزَّن في الشيفرة المصدرية ولا في ملفات الإعدادات المكشوفة، وتُدوَّر وفق سياسة محدّدة.",
              "Keys are held in a dedicated key-management service, never in source code or exposed configuration files, and are rotated on a defined schedule.",
            ),
            t(
              "كلمات المرور تُخزَّن بصيغة مشتقّة أحادية الاتجاه (تجزئة مع ملح)، ولا يستطيع أي موظف قراءتها أو استرجاعها.",
              "Passwords are stored as one-way salted hashes; no employee can read or recover them.",
            ),
            t(
              "بيانات الاعتماد للخدمات الخارجية تُحفظ في مخزن أسرار مركزي، والوصول إليه مسجّل ومحدود.",
              "Credentials for external services live in a central secrets store, with logged and restricted access.",
            ),
          ],
        },
      ],
    },
    {
      id: "access",
      title: t("الهوية وإدارة الوصول", "Identity and access"),
      blocks: [
        {
          ul: [
            t(
              "مبدأ أقلّ صلاحية ملزَم: لا تُمنح أي صلاحية إلا لحاجة عمل موثّقة، وتُراجَع الصلاحيات دوريًا وتُسحب فور تغيّر الدور.",
              "Least privilege is enforced: no access is granted without a documented need, permissions are reviewed on a schedule, and removed as soon as a role changes.",
            ),
            t(
              "الوصول الإداري إلى بيئة الإنتاج محصور في عدد محدود من المهندسين، ويعتمد مصادقة ثنائية إلزامية عبر تطبيق المصادقة.",
              "Administrative access to production is limited to a small number of engineers and requires two-factor authentication through an authenticator app.",
            ),
            t(
              "المصادقة الثنائية متاحة لكل مستخدمي المنصّة، ويستطيع مسؤول الجهة إلزام فريقه بها وأتمتة إدارة الحسابات عند التعليق أو إنهاء الخدمة.",
              "Two-factor authentication is available to every platform user; an entity's administrator can require it of the team and automate account handling when someone is suspended or leaves.",
            ),
            t(
              "الأدوار والصلاحيات تُدار على مستوى مساحة العمل والجدول والحقل، ويمكن تحديد من يرى ومن يعدّل ومن يشارك.",
              "Roles and permissions are managed at workspace, table, and field level, so it is defined who can view, edit, and share.",
            ),
            t(
              "روابط المشاركة العامة تُحمى بكلمة مرور تطلب من كل زائر، ويمكن إلغاؤها في أي وقت، وسجلّ الدخول يكشف من فتحها.",
              "Public share links are protected by a password requested from every visitor, can be revoked at any time, and the access log shows who opened them.",
            ),
            t(
              "أحداث تسجيل الدخول وتغييرات الصلاحيات والعمليات الحسّاسة تُدوَّن في سجلّ غير قابل للتعديل من المستخدمين، ويُراجَع عند الحاجة.",
              "Sign-in events, permission changes, and sensitive operations are recorded in a log users cannot alter, and reviewed when needed.",
            ),
          ],
        },
      ],
    },
    {
      id: "platform",
      title: t("عزل البيئات وتقوية الأنظمة", "Isolation and system hardening"),
      blocks: [
        {
          ul: [
            t(
              "كل مساحة عمل معزولة منطقيًا عن غيرها، ولا تتشارك قواعد البيانات ولا وسائط التخزين، ويُتحقّق من ذلك في كل إصدار.",
              "Every workspace is logically isolated from the others, sharing no databases or storage media; this is verified on each release.",
            ),
            t(
              "شبكة الإنتاج مقسّمة إلى طبقات، ولا تُفتح الخدمات الداخلية على الإنترنت إلا للقدر المطلوب وبعد المراجعة.",
              "The production network is segmented into layers, and internal services are exposed to the internet only where required and after review.",
            ),
            t(
              "طبقة حماية على الحدود تتضمّن تصفية الطلبات المشبوهة وتحديد المعدّل وحجب محاولات الاستغلال المعروفة.",
              "An edge protection layer filters suspicious requests, applies rate limiting, and blocks known exploitation attempts.",
            ),
            t(
              "إدارة تحديثات منظّمة: تُتابع الثغرات في المكوّنات والمكتبات، وتُرتَّب بحسب الخطورة، وتُصلَح في مدد محدّدة لكل مستوى.",
              "Patch management runs on a schedule: vulnerabilities in components and libraries are tracked, ranked by severity, and fixed within defined windows per level.",
            ),
            t(
              "دورة تطوير آمنة: مراجعة الشيفرة قبل الدمج، وبيئات فصلية، وفحص آلي للتبعيات، ولا تُنشر تغييرات في الإنتاج دون مراجعة وتوثيق.",
              "A secure development cycle: code review before merge, separate environments, automated dependency scanning, and no production change without review and a record.",
            ),
            t(
              "لا تُنسخ بيانات العملاء الحقيقية إلى بيئات التطوير أو الاختبار إلا بعد إخفاء هويتها، ولا تُستخدم بيانات إنتاج في العروض التوضيحية.",
              "Real customer data is not copied into development or test environments except after anonymisation, and production data is never used in demonstrations.",
            ),
          ],
        },
      ],
    },
    {
      id: "monitoring",
      title: t("المراقبة والاستجابة للحوادث", "Monitoring and incident response"),
      blocks: [
        {
          ul: [
            t(
              "مراقبة مستمرة للأحداث الأمنية وسجلّات الوصول، مع تنبيهات آلية على الأنماط غير المعتادة ومحاولات الدخول الفاشلة.",
              "Continuous monitoring of security events and access logs, with automatic alerts on unusual patterns and failed sign-in attempts.",
            ),
            t(
              "خطة استجابة للحوادث موثّقة بتصنيف للخطورة، ومسؤوليات محدّدة، وقنوات تصعيد، وأوقات استجابة لكل مستوى.",
              "A documented incident response plan with severity classes, defined responsibilities, escalation paths, and response times for each level.",
            ),
            t(
              "أولوية الاحتواء قبل أي شيء: إيقاف مصدر الحادث، وعزل الأنظمة المتأثّرة، وحفظ الأدلة الجنائية الرقمية قبل الاستعادة.",
              "Containment comes first: stop the source, isolate affected systems, and preserve digital evidence before any restoration.",
            ),
            t(
              "إبلاغ الهيئة السعودية للبيانات والذكاء الاصطناعي دون تأخير وفي مدة لا تتجاوز 72 ساعة عند وقوع تسرّب بيانات شخصية، وإبلاغ الجهات المتأثّرة بما يلزمها.",
              "SDAIA is notified without delay and no later than 72 hours when a personal data breach occurs, and affected entities are told what they need to know.",
            ),
            t(
              "بعد كل حادث: تحليل للسبب الجذري، وإجراءات تصحيحية موثّقة، ومراجعة تُغلق الثغرة التي سمحت به.",
              "After every incident: root-cause analysis, documented corrective actions, and a review that closes the gap that allowed it.",
            ),
          ],
        },
      ],
    },
    {
      id: "backup",
      title: t("النسخ الاحتياطي واستمرارية العمل", "Backups and continuity"),
      blocks: [
        {
          ul: [
            t(
              "نسخ احتياطي يومي مشفّر داخل المملكة، إضافة إلى استعادة إلى نقطة زمنية محدّدة لتصحيح الأخطاء دون فقدان بيانات اليوم.",
              "Encrypted daily backups inside the Kingdom, plus point-in-time restore so a mistake can be corrected without losing the day's data.",
            ),
            t(
              "إجراءات استعادة موثّقة ومُختبرة دوريًا، لأن النسخة التي لم تُجرَّب استعادتها لا تُعدّ نسخة.",
              "Documented restore procedures tested on a schedule, because a backup nobody has restored is not a backup.",
            ),
            t(
              "حماية النسخ الاحتياطية نفسها من الحذف أو التشفير بفعل هجوم أو خطأ بشري، بعزلها عن بيئة التشغيل المباشرة.",
              "Backups are themselves protected from deletion or encryption by attack or human error, isolated from the live environment.",
            ),
            t(
              "خطة لاستمرارية العمل واستعادة التشغيل بعد الحوادث الكبرى، بأدوار بديلة وترتيب لاستعادة الخدمات الحسّاسة أولًا.",
              "A business continuity and disaster recovery plan, with alternate roles and an order that restores critical services first.",
            ),
            t(
              "أهداف زمن الاستعادة ونقطة الاستعادة تُوثَّق في اتفاقية مستوى الخدمة المبرمة مع كل جهة، لا في صفحة عامة.",
              "Recovery time and recovery point objectives are recorded in the service level agreement signed with each entity, not on a public page.",
            ),
          ],
        },
      ],
    },
    {
      id: "risk",
      title: t("إدارة المخاطر والموردين", "Risk and suppliers"),
      blocks: [
        {
          ul: [
            t(
              "سجلّ مخاطر محدّث يُراجع دوريًا: كل خطر باحتماله وأثره ومالكه والإجراء المتّخذ حياله.",
              "A living risk register reviewed on a schedule: every risk with its likelihood, impact, owner, and treatment.",
            ),
            t(
              "لا ندخل في تعاقد مع مزوّد يلمس بيانات العملاء قبل تقييم أمني، ويُلتزم كتابيًا بالسرية وبالمعالجة وفق تعليماتنا فقط.",
              "No provider that touches customer data is engaged before a security assessment, and each commits in writing to confidentiality and to processing only on our instructions.",
            ),
            t(
              "عقود المعالجة مع الموردين تشمل الإخطار بالحوادث، وحق المراجعة، وحدود استخدام البيانات، وموقع التخزين.",
              "Processing contracts with suppliers cover incident notification, audit rights, limits on data use, and where data is stored.",
            ),
            t(
              "أي تغيير جوهري في البنية أو في الموردين يمرّ بإدارة تغيير موثّقة وتقييم أثر على الخصوصية والأمن.",
              "Any material change to the architecture or the supplier chain passes through documented change management and an impact assessment for privacy and security.",
            ),
          ],
        },
      ],
    },
    {
      id: "privacy",
      title: t("الخصوصية بالتصميم وتصنيف البيانات", "Privacy by design and data classification"),
      blocks: [
        {
          ul: [
            t(
              "نجمع الحدّ الأدنى من البيانات الشخصية، ونحدّد لكل مجموعة غرضها وسندها النظامي ومدة الاحتفاظ بها قبل أن نبنيها.",
              "We collect the minimum personal data, and each set has its purpose, legal basis, and retention defined before anything is built.",
            ),
            t(
              "البيانات تُصنَّف بحسب حساسيتها وفق سياسات إدارة البيانات الوطنية، وتُطبَّق ضوابط الوصول والتشفير والمشاركة بحسب التصنيف.",
              "Data is classified by sensitivity under the national data governance policies, and access, encryption, and sharing controls follow the classification.",
            ),
            t(
              "الاحتفاظ آليّ: تُحدَّد لكل فئة مدة، وتُحذف أو تُخفى هويتها عند انتهائها دون انتظار طلب.",
              "Retention is automated: each category has a period, and data is deleted or anonymised when it ends, without waiting for a request.",
            ),
            t(
              "الوصول إلى البيانات الشخصية مقيّد ومسجّل، ولا يُنفَّذ إلا لغرض موثّق كالدعم الفني بطلب من الجهة المعنيّة.",
              "Access to personal data is restricted and logged, and never happens outside a documented purpose such as support at the request of the entity concerned.",
            ),
            t(
              "الجهة العميلة تحتاج إلى تنفيذ حقوق أصحاب البيانات لديها؛ نقدّم لها أدوات التصدير والحذف والتحرير، ونساعدها في الطلبات المعقّدة.",
              "A customer needs to serve its own data-subject rights; we give it export, deletion, and editing tools and help with complex requests.",
            ),
          ],
        },
      ],
    },
    {
      id: "people",
      title: t("الأفراد والتدريب", "People and training"),
      blocks: [
        {
          ul: [
            t(
              "كل من يعمل على الخدمة يوقّع التزامًا بالسرية وحماية البيانات قبل أن يصل إلى أي نظام.",
              "Everyone who works on the service signs a confidentiality and data-protection undertaking before touching any system.",
            ),
            t(
              "تدريب عند الالتحاق وتحديث دوري يشمل الأمن السيبراني، وحماية البيانات الشخصية، وأساسيات التصيّد والهندسة الاجتماعية.",
              "Onboarding training and periodic refreshers covering cybersecurity, personal data protection, and the basics of phishing and social engineering.",
            ),
            t(
              "الوصول يُمنح بحسب الدور وضرورة العمل، ويُسحب في يوم انتهاء العلاقة أو تغيّر المهام، مع مراجعة دورية للأذونات.",
              "Access follows role and need, is revoked the day a relationship ends or duties change, and permissions are reviewed on a schedule.",
            ),
            t(
              "قنوات داخلية للإبلاغ عن أي شكّ أمني أو خطأ محتمل، دون لوم، لأن التقارير المبكرة هي أرخص وسائل الحماية.",
              "Internal channels to report any security doubt or possible mistake, without blame, because early reporting is the cheapest protection there is.",
            ),
          ],
        },
      ],
    },
    {
      id: "shared",
      title: t("المسؤولية المشتركة", "Shared responsibility"),
      blocks: [
        {
          p: t(
            "أمن البيانات مسؤولية مشتركة بيننا وبين الجهة المستخدمة. هذا التوزيع هو ما نعمل به في الخيار السحابي:",
            "Securing data is shared between us and the entity using the service. This is the split we work to in the cloud offering:",
          ),
        },
        {
          table: {
            caption: t("توزيع المسؤولية", "Who is responsible for what"),
            head: [t("المجال", "Area"), t("مسؤوليتنا", "Our responsibility"), t("مسؤولية الجهة", "The entity's responsibility")],
            rows: [
              [
                t("البنية التحتية", "Infrastructure"),
                t("الخوادم والشبكة والتخزين والتحديثات والتقوية", "Servers, network, storage, patching, hardening"),
                t("لا شيء — نديرها بالكامل في الخيار السحابي", "None — we run it end to end in the cloud offering"),
              ],
              [
                t("الوصول إلى الحساب", "Account access"),
                t("توفير المصادقة الثنائية وسجلّ الأحداث وضوابط الجلسات", "Providing two-factor authentication, event logs, and session controls"),
                t("إدارة المستخدمين والأدوار، وسرية بيانات الدخول، وسحب الصلاحيات عند تغيّر المهام", "Managing users and roles, keeping credentials secret, and removing access when duties change"),
              ],
              [
                t("المحتوى والتصنيف", "Content and classification"),
                t("توفير أدوات الصلاحيات والتصنيف والاحتفاظ والحذف", "Providing permission, classification, retention, and deletion tools"),
                t("تحديد ما يُدخل إلى المنصّة ومن يراه، والتأكد من مشروعية معالجته", "Deciding what goes into the platform and who sees it, and ensuring the processing is lawful"),
              ],
              [
                t("النسخ الاحتياطي", "Backups"),
                t("نسخ يومي واستعادة إلى نقطة زمنية وإجراءات مُختبرة", "Daily backups, point-in-time restore, tested procedures"),
                t("استخدام الاستعادة عند الخطأ التشغيلي، والاحتفاظ بنسخة تصدير خاصة عند الحاجة", "Restoring after an operational mistake, and keeping its own export where needed"),
              ],
              [
                t("حماية بيانات الدخول", "Credential protection"),
                t("تشفير النقل والتخزين والتحقق من الجلسات", "Encrypting traffic and storage, and validating sessions"),
                t("عدم مشاركة الحسابات، وتفعيل المصادقة الثنائية، واستخدام المتصفّح والأجهزة الموثوقة", "Not sharing accounts, enabling two-factor authentication, and using trusted browsers and devices"),
              ],
              [
                t("الإبلاغ", "Reporting"),
                t("إبلاغ سدايا والجهات المتأثّرة وفق النظام عند التسرّب", "Notifying SDAIA and affected parties as the law requires in a breach"),
                t("إبلاغنا فورًا عن أي اشتباه في وصول غير مصرّح به أو تسرّب", "Telling us at once about any suspected unauthorised access or breach"),
              ],
            ],
          },
        },
      ],
    },
    {
      id: "assurance",
      title: t("المراجعة والوثائق المتاحة", "Assurance, and the documents we provide"),
      blocks: [
        {
          ul: [
            t(
              "مراجعة داخلية دورية للضوابط مقابل الأطر المرجعية، مع خطة معالجة للفجوات ومسؤول لكل بند وتاريخ إنجاز.",
              "Periodic internal review of our controls against the reference frameworks, with a gap-remediation plan, an owner for each item, and a due date.",
            ),
            t(
              "مراجعة إدارية سنوية للنتائج والمخاطر والحوادث، تُحدَّث بعدها السياسات والضوابط.",
              "An annual management review of results, risks, and incidents, after which the policies and controls are updated.",
            ),
            t(
              "اختبار اختراق دوري بطرف مستقل، وبرنامج لإدارة الثغرات بمدد إصلاح محدّدة بحسب الخطورة.",
              "Periodic penetration testing by an independent party, and a vulnerability management programme with fix windows set by severity.",
            ),
            t(
              "اختبار استعادة النسخ الاحتياطية، ومحاكاة سيناريوهات الحوادث على بيئة غير إنتاجية.",
              "Backup restore testing, and incident scenario exercises on a non-production environment.",
            ),
          ],
        },
        {
          p: t("وللجهات التي تراجع الخدمة قبل الاعتماد أو بعده، نوفّر كتابيًا:", "For entities assessing the service before or after contracting, we provide in writing:"),
        },
        {
          ul: [
            t(
              "ملف الأمن والامتثال: البنية، وضوابط التشغيل، وموقع البيانات، ومسار الحوادث، ومتطلبات التركيب المحلي.",
              "The security and compliance pack: architecture, operating controls, data location, incident path, and on-premises requirements.",
            ),
            t(
              "اتفاقية معالجة البيانات: الأدوار، والتعليمات، والسرية، والإخطار، وحق المراجعة، ومصير البيانات عند انتهاء التعاقد.",
              "The data processing agreement: roles, instructions, confidentiality, notification, audit rights, and what happens to data when the contract ends.",
            ),
            t(
              "قائمة الجهات المعالجة، ومصفوفة المواءمة بين ضوابطنا والضوابط الوطنية المطلوبة من الجهة.",
              "The processor list, and a mapping between our controls and the national controls the entity is required to meet.",
            ),
            t(
              "ملخص نتائج اختبار الاختراق الأخير واختبارات الاستعادة، وصيغة الحوادث والإخطار المعتمدة لدينا.",
              "A summary of the latest penetration test and restore tests, and our incident and notification templates.",
            ),
          ],
        },
        {
          note: t(
            "لتجنّب أي لبس: ما ورد أعلاه وصف لممارساتنا والتزاماتنا، وليس استشارة قانونية ولا شهادة اعتماد. والجهة مسؤولة عن تقييم مدى ملاءمتها لمتطلباتها التنظيمية الخاصة.",
            "To avoid any confusion: what is written here describes our practices and commitments. It is not legal advice and not an accreditation. Each entity remains responsible for assessing how far it meets its own regulatory requirements.",
          ),
        },
      ],
    },
    {
      id: "onprem",
      title: t("خيار التركيب المحلي", "The on-premises option"),
      blocks: [
        {
          ul: [
            t(
              "يتولّى فريق «جداول» تركيب المنصّة داخل مركز بيانات الجهة أو المنشأة، على خوادمها وضمن شبكتها، ويبقى التحكم بالخوادم والبيانات لديها.",
              "The Jadawel team installs the platform inside the entity's own data centre, on its servers and within its network, and control of the servers and the data stays with the entity.",
            ),
            t(
              "نسلّم مع التركيب متطلبات التهيئة الآمنة، وقائمة المنافذ والخدمات، ومسار التحديثات، ودليل تشغيل يقابل الضوابط الوطنية.",
              "The install ships with secure configuration requirements, the list of ports and services, the update path, and a runbook mapped to the national controls.",
            ),
            t(
              "لا تصل إلينا بيانات الجهة إلا إذا طلبت تدخّلًا في إطار الدعم، وبموافقتها وبالحدّ الذي تحدّده.",
              "The entity's data reaches us only if it asks us to step in for support, with its approval and within the limits it sets.",
            ),
            t(
              "المسؤولية عن التقوية والنسخ الاحتياطي والمراقبة تنتقل إلى فرق الجهة بعد التسليم، ونوفّر التدريب ونقاط التحقّق اللازمة لذلك.",
              "Responsibility for hardening, backups, and monitoring moves to the entity's teams after handover, and we provide the training and checkpoints that needs.",
            ),
          ],
        },
      ],
    },
    {
      id: "report",
      title: t("الإبلاغ عن ثغرة أو حادث", "Reporting a vulnerability or an incident"),
      blocks: [
        {
          p: t(
            "إذا اكتشفت ثغرة في موقعنا أو منصّتنا، أو لاحظت سلوكًا مشتبهًا، راسلنا على info@jadawl.site بعنوان يبدأ بكلمة «أمني»، وأرفق ما يساعدنا على إعادة الإنتاج. نؤكّد الاستلام خلال يوم عمل، ونمضي في المعالجة، ونُبلغك بالنتيجة.",
            "If you find a vulnerability in our website or platform, or notice suspicious behaviour, write to info@jadawl.site with a subject line starting with \"security\" and include what helps us reproduce it. We acknowledge receipt within one working day, work the issue, and tell you the outcome.",
          ),
        },
        {
          ul: [
            t(
              "نرحّب بالبحث بحسن نية، ونتعامل معه بوصفه مساهمة في حماية الخدمة لا اعتداءً عليها.",
              "We welcome good-faith research and treat it as a contribution to protecting the service, not an attack on it.",
            ),
            t(
              "نطلب عدم الوصول إلى بيانات العملاء أو تعديلها أو حذفها، وعدم تعطيل الخدمة أو تجاوز الحدود.",
              "We ask that you do not access, alter, or delete customer data, disrupt the service, or cross its boundaries.",
            ),
            t(
              "نمنح مدة معقولة قبل النشر العلني، ونتّفق معك على توقيت الإفصاح بعد إغلاق الثغرة.",
              "We ask for a reasonable window before public disclosure, and agree the timing with you once the issue is closed.",
            ),
            t(
              "لتبليغ الحوادث الأمنية العاجلة: يبدأ عنوان الرسالة بـ «أمني — عاجل»، ويُوجَّه إلى البريد نفسه مع ذكر رقم تواصل للردّ.",
              "For urgent security incidents: start the subject with \"security — urgent\", send it to the same address, and include a number we can call back on.",
            ),
          ],
        },
      ],
    },
  ],
};
