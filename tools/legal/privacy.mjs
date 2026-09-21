/**
 * «الخصوصية وحماية البيانات» — the content of privacy.html, in both languages.
 *
 * One block per idea, Arabic first, English beside it: the generator writes the
 * Arabic into the page and both languages into the page's dictionary, so the
 * language switch works on the same markup the rest of the site uses.
 *
 * Sources this document answers to:
 *   - نظام حماية البيانات الشخصية (المرسوم الملكي رقم م/19 وتاريخ 9/2/1443هـ)
 *   - اللائحة التنفيذية لنظام حماية البيانات الشخصية (سدايا)
 *   - اللائحة التنفيذية لتنظيم نقل البيانات الشخصية خارج المملكة (سدايا)
 *
 * Controls described as ours are our own commitments; nothing here claims a
 * certificate or an accreditation.
 */
const t = (ar, en) => ({ ar, en });

export default {
  slug: "privacy",
  key: "lg.privacy",
  updated: t("21 سبتمبر 2026", "21 September 2026"),
  version: "1.0",
  title: t("الخصوصية وحماية البيانات", "Privacy and data protection"),
  eyebrow: t("الوثائق القانونية", "Legal documents"),
  lede: t(
    "كيف نجمع بياناتك الشخصية ونستخدمها ونحفظها ونحميها في موقع «جداول» ومنصّتها، وما الذي يضمنه لك النظام في المملكة العربية السعودية ومتى نُخطرك.",
    "How Jadawel collects, uses, stores, and protects personal data on its website and platform, what Saudi law guarantees you, and when we tell you about a change.",
  ),
  desc: t(
    "سياسة الخصوصية وحماية البيانات في «جداول» وفق نظام حماية البيانات الشخصية في المملكة العربية السعودية: ما نجمعه، ومدد الاحتفاظ، وحقوقك، والإبلاغ عن التسرب.",
    "Jadawel privacy and data protection policy under Saudi Arabia's Personal Data Protection Law: what we collect, retention, your rights, and breach notification.",
  ),
  sections: [
    {
      id: "who",
      title: t("من نحن ونطاق هذه السياسة", "Who we are and what this policy covers"),
      blocks: [
        {
          p: t(
            "تصدر سياسة الخصوصية هذه عن «جداول» (Jadawel)، مالكة هذا الموقع ومنصّة «جداول» المتاحة على app.jadawl.site، بصفتها المتحكّم بالبيانات الشخصية التي تُجمع عبر الموقع وأثناء التعاقد والدعم، وذلك وفق نظام حماية البيانات الشخصية في المملكة العربية السعودية ولائحته التنفيذية الصادرة عن الهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا).",
            "This policy is issued by Jadawel, the owner of this website and of the Jadawel platform served at app.jadawl.site. Jadawel is the controller of the personal data collected through the website and in the course of contracting and support, under the Personal Data Protection Law of the Kingdom of Saudi Arabia and its Implementing Regulations issued by the Saudi Data and Artificial Intelligence Authority (SDAIA).",
          ),
        },
        { h3: t("الأدوار: متحكّم ومعالج", "The two roles: controller and processor") },
        {
          ul: [
            t(
              "متحكّم: في بيانات الزوار وطلبات التواصل والمراسلات التجارية وبيانات الحساب الإداري للجهة العميلة، وفي كل ما نقرّر غرضه وطريقة معالجته بأنفسنا.",
              "Controller: for visitor data, contact and commercial correspondence, and the administrative account data of a customer entity, and for anything whose purpose and means we decide ourselves.",
            ),
            t(
              "معالج: في البيانات التي تُدخلها الجهة العميلة داخل مساحات العمل في المنصّة، بما فيها قواعد البيانات والمرفقات. الجهة العميلة هي المتحكّم بهذه البيانات، ونعالجها بحسب تعليماتها وبموجب اتفاقية معالجة البيانات المبرمة معها.",
              "Processor: for the data a customer entity puts into workspaces on the platform, including databases and attachments. The customer is the controller of that data; we process it on its documented instructions and under the data processing agreement signed with it.",
            ),
            t(
              "نطاق هذه السياسة: الموقع التسويقي وطلبات العرض والتواصل، وحسابات المنصّة وإدارتها، والدعم الفني، والمراسلات المرتبطة بها. ولا تنطبق على بيانات تُعالجها جهة عميلة بموجب اتفاقية مستقلة بينها وبين أصحاب تلك البيانات.",
              "What this policy covers: the marketing site, demo requests and enquiries, platform accounts and their administration, technical support, and the correspondence around them. It does not govern data a customer entity processes under a separate arrangement with the individuals concerned.",
            ),
          ],
        },
      ],
    },
    {
      id: "collect",
      title: t("البيانات التي نجمعها ولماذا", "What we collect, and why"),
      blocks: [
        {
          p: t(
            "نجمع الحدّ اللازم فقط، ولكل فئة غرض واضح وسند نظامي محدّد. لا نطلب عبر الموقع بيانات حساسة كالبيانات الصحية أو المالية أو بيانات الهوية الرسمية، ولا تجمع المنصّة بيانات شخصية لأغراض إعلانية.",
            "We collect the minimum necessary, and every category has a defined purpose and a stated legal basis. We never ask for sensitive data such as health or financial data or official identity documents through the website, and the platform collects no personal data for advertising.",
          ),
        },
        {
          table: {
            caption: t("فئات البيانات وأغراضها", "Categories of data and their purposes"),
            head: [
              t("الفئة", "Category"),
              t("أمثلة", "Examples"),
              t("الغرض", "Purpose"),
              t("السند النظامي", "Legal basis"),
            ],
            rows: [
              [
                t("طلبات التواصل والعرض التوضيحي", "Contact and demo requests"),
                t("الاسم، البريد الإلكتروني، الجهة، رقم التواصل، نصّ الرسالة", "Name, email, entity, phone number, message"),
                t("الردّ على طلبك وترتيب عرض توضيحي ومتابعة التعاقد", "Replying to your request, arranging a demo, following up on contracting"),
                t("موافقتك عند الإرسال، ثم تنفيذ إجراءات ما قبل التعاقد", "Your consent on submission, then steps prior to entering a contract"),
              ],
              [
                t("بيانات الحساب الإداري للجهة", "The entity's administrative account data"),
                t("اسم المسؤول، بريد العمل، الدور والصلاحيات", "Administrator name, work email, role and permissions"),
                t("إنشاء مساحة العمل وتشغيل الحساب وإدارة الصلاحيات", "Creating the workspace, running the account, managing permissions"),
                t("تنفيذ العقد المبرم مع الجهة", "Performance of the contract with the entity"),
              ],
              [
                t("بيانات المحتوى داخل المنصّة", "Content data inside the platform"),
                t("الجداول والصفوف والمرفقات وما تُنشئه الفرق", "Tables, rows, attachments, and what teams create"),
                t("تشغيل الخدمة المطلوبة وحفظها ونسخها احتياطيًا", "Providing, storing, and backing up the service you asked for"),
                t("تعليمات الجهة العميلة بوصفنا معالجًا لها", "The customer's instructions, as its processor"),
              ],
              [
                t("بيانات الفواتير والاشتراك", "Billing and subscription data"),
                t("اسم الجهة، الرقم الضريبي، بيانات الفاتورة وسدادها", "Entity name, VAT number, invoice and payment records"),
                t("إصدار الفواتير والالتزامات المحاسبية والضريبية", "Issuing invoices and meeting accounting and tax obligations"),
                t("التزام نظامي، وتنفيذ العقد", "Legal obligation, and performance of the contract"),
              ],
              [
                t("سجلّات تقنية وأمنية", "Technical and security logs"),
                t("عنوان IP، وقت الوصول، نوع المتصفّح، أحداث الدخول والتغيير", "IP address, access time, browser type, sign-in and change events"),
                t("حماية الخدمة وكشف الوصول غير المصرّح به وتشخيص الأعطال", "Protecting the service, detecting unauthorised access, diagnosing faults"),
                t("المصلحة المشروعة في أمن الخدمة", "Legitimate interest in the security of the service"),
              ],
              [
                t("تفضيل اللغة", "Language preference"),
                t("اختيار العربية أو الإنجليزية، محفوظًا في متصفّحك", "Arabic or English, stored in your browser"),
                t("عرض الموقع باللغة التي اخترتها في زياراتك التالية", "Serving the site in the language you chose on your next visits"),
                t("تخزين محلي ضروري تقنيًا، بلا تتبّع", "Technically necessary local storage, with no tracking"),
              ],
              [
                t("تحليلات مجمّعة", "Aggregated analytics"),
                t("عدد الزيارات والصفحات الأكثر قراءة، بلا تعريف شخصي", "Visit counts and most-read pages, with no identification"),
                t("فهم استخدام الموقع وتحسين محتواه", "Understanding how the site is used and improving it"),
                t("المصلحة المشروعة في تطوير الخدمة", "Legitimate interest in improving the service"),
              ],
            ],
          },
        },
        {
          note: t(
            "لا نستخدم بياناتك الشخصية في الإعلانات، ولا نبيعها أو نشاركها مع وسطاء بيانات، ولا نستخدم محتوى مساحات العمل لأي غرض غير تشغيل الخدمة المطلوبة منّا.",
            "We do not use your personal data for advertising, we do not sell it or share it with data brokers, and we never use workspace content for anything other than providing the service you asked us for.",
          ),
        },
      ],
    },
    {
      id: "basis",
      title: t("أساس المعالجة", "The basis we rely on"),
      blocks: [
        {
          dl: [
            {
              t: t("الموافقة", "Consent"),
              d: t(
                "عند إرسال طلب تواصل أو الاشتراك في مراسلاتنا، يمكنك سحب موافقتك في أي وقت، دون أن يمسّ ذلك مشروعية ما تمّ قبل السحب.",
                "When you send an enquiry or subscribe to our correspondence, you may withdraw consent at any time, without affecting the lawfulness of what was done before withdrawal.",
              ),
            },
            {
              t: t("تنفيذ العقد", "Performance of a contract"),
              d: t(
                "لمعالجة ما يلزم لإنشاء الحساب وتشغيل الخدمة وإصدار الفواتير وتقديم الدعم.",
                "To do what is needed to create the account, run the service, issue invoices, and provide support.",
              ),
            },
            {
              t: t("المصلحة المشروعة", "Legitimate interest"),
              d: t(
                "لأمن الخدمة ومنع إساءة الاستخدام وتشخيص الأعطال وتحسين الموقع، مع موازنة ذلك بحقوقك وعدم استخدامه للتسويق بغير إذن.",
                "For service security, abuse prevention, fault diagnosis, and site improvement, balanced against your rights and never used for marketing without your consent.",
              ),
            },
            {
              t: t("التزام نظامي", "Legal obligation"),
              d: t(
                "لحفظ السجلّات المحاسبية والضريبية، والاستجابة للطلبات المشروعة من الجهات المختصة.",
                "To keep accounting and tax records and to respond to lawful requests from competent authorities.",
              ),
            },
          ],
        },
      ],
    },
    {
      id: "cookies",
      title: t("ملفات تعريف الارتباط والتخزين المحلي", "Cookies and local storage"),
      blocks: [
        {
          p: t(
            "لا يستخدم هذا الموقع ملفات تعريف ارتباط للتتبّع أو الإعلان أو التحليل عبر الأطراف الثالثة. والقدر الوحيد المحفوظ في متصفّحك هو تفضيل اللغة، لتُعرض الصفحات باللغة التي اخترتها.",
            "This website sets no cookies for tracking, advertising, or third-party analytics. The only thing stored in your browser is your language preference, so pages are served in the language you chose.",
          ),
        },
        {
          ul: [
            t(
              "مفتاح التخزين المحلي: jadawel-lang، ويحمل قيمة واحدة (ar أو en)، ويمكنك حذفه من إعدادات المتصفّح في أي وقت دون أن يتأثّر استخدامك للخدمة.",
              "The local-storage key is jadawel-lang and it holds a single value (ar or en). You can clear it from your browser settings at any time without affecting your use of the service.",
            ),
            t(
              "لا نستخدم أدوات تحليلية تتبع الأفراد، ولا نضمّن شبكات إعلانية أو أزرار مشاركة تجلب ملفات طرف ثالث.",
              "We use no analytics tool that follows individuals, and we embed no ad networks or share buttons that pull third-party files.",
            ),
            t(
              "إن أضفنا مستقبلًا أي قياس مجمّع أو ملف تعريف ارتباط ضروري، فسنحدّث هذه السياسة ونوضّح الغرض قبل تفعيله.",
              "If we ever add aggregated measurement or a necessary cookie, we will update this policy and state its purpose before switching it on.",
            ),
          ],
        },
      ],
    },
    {
      id: "location",
      title: t("موقع البيانات والنقل خارج المملكة", "Where the data lives, and transfers outside the Kingdom"),
      blocks: [
        {
          ul: [
            t(
              "الخدمة السحابية تُخزَّن وتُعالَج في مراكز بيانات داخل المملكة العربية السعودية، في مدينة الرياض، بما يشمل قواعد البيانات والمرفقات والنسخ الاحتياطية.",
              "The cloud service is stored and processed in data centres inside the Kingdom of Saudi Arabia, in Riyadh, including databases, attachments, and backups.",
            ),
            t(
              "لا ننقل البيانات الشخصية إلى خارج المملكة ولا نستعين ببنية تحتية خارج حدودها لتخزينها أو معالجتها، التزامًا بالنظام ولائحته التنفيذية ولائحة تنظيم نقل البيانات الشخصية خارج المملكة الصادرة عن سدايا، وبمتطلبات تحديد موقع البيانات في ضوابط الأمن السيبراني للحوسبة السحابية.",
              "We do not transfer personal data outside the Kingdom, and we use no infrastructure beyond its borders to store or process it, in line with the Law, its Implementing Regulations, SDAIA's regulations on transferring personal data outside the Kingdom, and the data-location requirements in the national cloud cybersecurity controls.",
            ),
            t(
              "في التركيب المحلي تبقى البيانات كاملةً داخل بنية الجهة العميلة وتحت مسؤوليتها، ولا تصل إلينا أي بيانات تشغيلية إلا إذا طلبت الجهة تدخّلًا في إطار الدعم.",
              "With an on-premises install, the data stays entirely within the customer's own infrastructure and under its responsibility. No operational data reaches us unless the customer asks us to step in as part of support.",
            ),
          ],
        },
        {
          p: t(
            "استثناء تقني واحد نُفصح عنه: تسليم البريد الإلكتروني. فقد تمرّ رسالة أُرسلت من الموقع أو من المنصّة عبر مزوّد إرسال بريد يقع خارج المملكة بحكم طبيعة بروتوكول البريد، ويقتصر ما يصل إليه على الحدّ الأدنى اللازم لإتمام الإرسال (عنوان المستلم ونصّ الرسالة)، وبموجب التزامات تعاقدية بالسرية وعدم الاستخدام لغرض آخر.",
            "One technical exception, stated plainly: email delivery. A message sent from the website or the platform may pass through an email-sending provider located outside the Kingdom, because that is how mail transport works. What reaches it is the minimum needed to deliver the message (the recipient address and the message text), under contractual duties of confidentiality and no other use.",
          ),
        },
        {
          p: t(
            "وإذا طلبت جهة عميلة معالجة بياناتها خارج المملكة لحاجة تشغيلية خاصة بها، فلا يُنفَّذ ذلك إلّا بموافقتها الكتابية وبعد تقييم مستوى الحماية واتخاذ الضمانات التي تفرضها سدايا، وبما لا يخالف الأنظمة السارية.",
            "If a customer asks us to process its data outside the Kingdom for an operational need of its own, we do it only on its written instruction, after assessing the level of protection and putting the safeguards SDAIA requires in place, and only where the applicable laws allow it.",
          ),
        },
      ],
    },
    {
      id: "retention",
      title: t("مدة الاحتفاظ", "How long we keep it"),
      blocks: [
        {
          p: t(
            "نحتفظ بالبيانات للمدة اللازمة لتحقيق الغرض الذي جُمعت من أجله أو للمدة التي يفرضها النظام، ثم نتلفها أو نحذفها أو نجعلها غير قابلة للربط بأصحابها.",
            "We keep data for as long as it serves the purpose it was collected for, or for as long as the law requires, and then we destroy it, delete it, or make it impossible to link back to its owners.",
          ),
        },
        {
          table: {
            caption: t("مدد الاحتفاظ", "Retention periods"),
            head: [t("الفئة", "Category"), t("المدة", "Period"), t("ما يحدث بعدها", "What happens next")],
            rows: [
              [
                t("طلبات التواصل والعرض التوضيحي", "Contact and demo requests"),
                t("24 شهرًا من آخر مراسلة", "24 months from the last message"),
                t("تُحذف من الأنظمة التشغيلية", "Deleted from operational systems"),
              ],
              [
                t("بيانات الحساب الإداري", "Administrative account data"),
                t("مدة التعاقد، ثم 30 يومًا بعد انتهائه", "For the term, then 30 days after it ends"),
                t("نافذة تصدير ثم إتلاف", "An export window, then destruction"),
              ],
              [
                t("محتوى مساحات العمل", "Workspace content"),
                t("مدة التعاقد وما يتفق عليه في اتفاقية المعالجة", "The term, as set out in the processing agreement"),
                t("تسليم نسخة ثم حذف نهائي بمطالبة الجهة", "Handover of a copy, then permanent deletion on the customer's request"),
              ],
              [
                t("سجلّات الوصول التقنية", "Technical access logs"),
                t("90 يومًا", "90 days"),
                t("استبدال تلقائي بالتدوير", "Automatically replaced by rotation"),
              ],
              [
                t("النسخ الاحتياطية", "Backups"),
                t("وفق دورة الاحتفاظ المعتمدة للتشغيل والاستعادة", "Per the approved operational and restore cycle"),
                t("تُستبدل تلقائيًا، ولا تُستخدم لغير الاستعادة", "Rotated automatically, never used for anything but restore"),
              ],
              [
                t("الفواتير والسجلّات المالية", "Invoices and financial records"),
                t("المدد التي تفرضها الأنظمة المالية والضريبية", "The periods required by financial and tax law"),
                t("حفظ نظامي ثم إتلاف", "Statutory retention, then destruction"),
              ],
              [
                t("سجلّات الدعم والمراسلات", "Support records and correspondence"),
                t("24 شهرًا من إغلاق التذكرة", "24 months from ticket closure"),
                t("حذف أو إخفاء هوية", "Deletion or anonymisation"),
              ],
            ],
          },
        },
      ],
    },
    {
      id: "sharing",
      title: t("المشاركة والجهات التي تعالج البيانات معنا", "Sharing and the providers who process with us"),
      blocks: [
        {
          ul: [
            t(
              "لا نبيع البيانات الشخصية ولا نتشاركها لأغراض تجارية أو إعلانية.",
              "We do not sell personal data and do not share it for commercial or advertising purposes.",
            ),
            t(
              "مزوّدو الاستضافة السحابية داخل المملكة: يشغّلون البنية التحتية التي تعمل عليها الخدمة، وبموجب عقد يعالجون فيه البيانات بتعليماتنا فقط.",
              "Cloud hosting providers inside the Kingdom: they run the infrastructure the service sits on, under a contract that lets them process data only on our instructions.",
            ),
            t(
              "مزوّد البريد الإلكتروني: لتسليم الرسائل والتنبيهات، بما لا يتجاوز الحدّ الأدنى اللازم للإرسال.",
              "The email provider: to deliver messages and alerts, with nothing beyond the minimum needed to send them.",
            ),
            t(
              "مزوّدو الدعم والأدوات الداخلية: لمساعدتنا في تشغيل الخدمة وتشخيص الأعطال، بصلاحيات محدودة ومسجّلة.",
              "Support providers and internal tooling: to help us run the service and diagnose faults, under limited and logged access.",
            ),
            t(
              "الجهات المختصة: عند وجود طلب نظامي مكتوب، وبالحدّ الذي يقتضيه الطلب، ومع إبلاغ العميل متى جاز لنا ذلك.",
              "Competent authorities: where there is a written lawful request, to the extent the request requires, and with notice to the customer where we are allowed to give it.",
            ),
          ],
        },
        {
          note: t(
            "قائمة الجهات المعالجة محدّثة ومتاحة للعميل عند الطلب. ونُخطر العميل قبل أي إضافة جوهرية تمسّ بياناته، بما يتيح له الاعتراض وفق اتفاقية المعالجة.",
            "The list of processors is current and available to a customer on request. We notify the customer before any material addition that affects its data, so it has the chance to object under the processing agreement.",
          ),
        },
      ],
    },
    {
      id: "rights",
      title: t("حقوقك وكيف تمارسها", "Your rights, and how to use them"),
      blocks: [
        {
          p: t(
            "يكفل لك نظام حماية البيانات الشخصية مجموعة من الحقوق، ونمارسها لك عمليًا لا على الورق:",
            "The Personal Data Protection Law gives you a set of rights, and we honour them in practice:",
          ),
        },
        {
          ul: [
            t(
              "العلم بأسباب جمع بياناتك والغرض منه، وهو ما توضّحه هذه السياسة فئةً فئة.",
              "To know why your data is collected and what for, which this policy sets out category by category.",
            ),
            t(
              "الوصول إلى بياناتك الشخصية لدينا والحصول على نسخة منها بصيغة قابلة للقراءة.",
              "To access your personal data with us and receive a copy in a readable format.",
            ),
            t("طلب تصحيح بيانات غير دقيقة أو غير مكتملة أو غير محدّثة.", "To have inaccurate, incomplete, or outdated data corrected."),
            t(
              "طلب إتلاف بياناتك أو حذفها، مع مراعاة ما يوجبه النظام من مدد حفظ.",
              "To have your data destroyed or deleted, subject to the retention the law requires.",
            ),
            t("سحب موافقتك في أي وقت، دون أثر رجعي على ما تمّ قبل السحب.", "To withdraw consent at any time, with no retroactive effect."),
            t(
              "الاعتراض على معالجة معيّنة، وسنوقفها ما لم يوجد سبب نظامي يمنع ذلك.",
              "To object to a given processing activity, which we then stop unless the law requires otherwise.",
            ),
          ],
        },
        {
          p: t(
            "لطلب أي من هذه الحقوق راسلنا على info@jadawl.site من البريد الذي تعاملت به معنا. نستجيب خلال 30 يومًا من التحقّق من هويتك، وقد نمدّها وفق ما يسمح به النظام إذا كان الطلب معقّدًا، ونُخبرك بالسبب والمدة. ولا تتقاضى مقابلًا على ممارسة الحقوق. وإذا كانت بياناتك داخل مساحة عمل جهة عميلة، فوجّه الطلب إلى تلك الجهة أولًا بوصفها المتحكّم، ونساعدها في تنفيذه.",
            "To exercise any of these rights, write to info@jadawl.site from the address you dealt with us from. We respond within 30 days of verifying your identity; where a request is complex we may extend that as the law allows, and we tell you why and for how long. Exercising these rights is free. If your data sits inside a customer's workspace, direct the request to that entity first, as the controller, and we help it carry the request out.",
          ),
        },
        {
          p: t(
            "وإذا رأيت أن معالجتنا تخالف النظام ولم يصلك منّا ما يرضيك، فلك أن تقدّم شكوى إلى الهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا) بصفتها الجهة المختصة بحماية البيانات الشخصية في المملكة.",
            "If you believe our processing breaches the Law and our answer does not satisfy you, you may lodge a complaint with the Saudi Data and Artificial Intelligence Authority (SDAIA), the authority responsible for personal data protection in the Kingdom.",
          ),
        },
      ],
    },
    {
      id: "security",
      title: t("كيف نحفظ البيانات", "How we keep the data safe"),
      blocks: [
        {
          ul: [
            t(
              "تشفير الاتصال بالموقع والخدمة بمعيار TLS 1.3، وتشفير التخزين بمعيار AES-256.",
              "Traffic to the website and the service is encrypted with TLS 1.3, and storage is encrypted with AES-256.",
            ),
            t(
              "صلاحيات بأقلّ قدر لازم، ومصادقة ثنائية للوصول الإداري، وسجلّ تغييرات يوثّق الأحداث الحسّاسة.",
              "Least-privilege access, two-factor authentication for administrative access, and a change log that records sensitive events.",
            ),
            t(
              "نسخ احتياطي يومي واستعادة إلى نقطة زمنية محدّدة، مع إجراءات استعادة موثّقة ومُختبرة.",
              "Daily backups with point-in-time restore, under documented and tested restore procedures.",
            ),
            t(
              "بيئة إنتاج منفصلة، ولا تُستخدم بيانات العملاء الحقيقية في بيئات الاختبار دون إخفاء هوية.",
              "A separate production environment, and no real customer data in test environments without anonymisation.",
            ),
          ],
        },
        {
          p: t(
            "تفصيل الضوابط والأطر التي نبني عليها موجود في وثيقة الأمان والامتثال، وهي مكمّلة لهذه السياسة.",
            "The controls and frameworks we build on are set out in full in the security and compliance document, which complements this policy.",
          ),
        },
        { link: { href: "security.html", label: t("الانتقال إلى الأمان والامتثال", "Read security and compliance") } },
      ],
    },
    {
      id: "breach",
      title: t("الإبلاغ عن تسرّب البيانات", "If personal data is breached"),
      blocks: [
        {
          ul: [
            t(
              "نُفعّل خطة الاستجابة للحوادث فورًا: احتواء الحادث، وإيقاف مصدر التسرّب، وحفظ الأدلة، وتقييم نطاق التأثير.",
              "We start the incident response plan at once: contain the incident, stop the source, preserve evidence, and assess the scope of impact.",
            ),
            t(
              "نُبلغ الهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا) دون تأخير، وفي مدة لا تتجاوز 72 ساعة من علمنا بالتسرّب، وفق النموذج المعتمد لديها.",
              "We notify SDAIA without delay and no later than 72 hours from becoming aware of the breach, using its official form.",
            ),
            t(
              "نُبلغ أصحاب البيانات المتأثّرين عند احتمال أن يلحق بهم ضرر، بلغة واضحة وبما يساعدهم على تجنّب الضرر.",
              "We notify affected individuals where harm to them is likely, in plain language and with what they need to avoid it.",
            ),
            t(
              "نُبلغ الجهة العميلة المعنيّة بحكم كوننا معالجًا لها، ونوفّر لها ما تحتاجه للوفاء بالتزاماتها النظامية أمام أصحاب البيانات.",
              "We notify the customer concerned, because we are its processor, and give it what it needs to meet its own obligations toward data subjects.",
            ),
            t(
              "نُوثّق الحادث وأسبابه الجذرية والإجراءات التصحيحية، ونراجعها لاحقًا لمنع تكرارها.",
              "We record the incident, its root cause, and the corrective actions, and review them afterwards so it does not recur.",
            ),
          ],
        },
      ],
    },
    {
      id: "children",
      title: t("الأطفال والقُصّر", "Children and minors"),
      blocks: [
        {
          p: t(
            "الخدمة موجّهة إلى الجهات والمنشآت وإلى العاملين فيها، وليست موجّهة إلى الأطفال. ولا نجمع عن قصد بيانات شخصية لمن دون السنّ القانونية، وإذا علمنا بذلك حذفناها دون تأخير. وإذا كان استخدام القُصّر ضروريًا في سياق تعليمي أو حكومي، فيكون بموافقة ولي الأمر وبإشراف الجهة المعنيّة.",
            "The service is built for entities and the people who work in them; it is not directed at children. We do not knowingly collect personal data from anyone below the legal age, and if we learn we have, we delete it without delay. Where minors must use it in an educational or governmental setting, it is with guardian consent and the entity's supervision.",
          ),
        },
      ],
    },
    {
      id: "changes",
      title: t("التحديثات على هذه السياسة", "Changes to this policy"),
      blocks: [
        {
          p: t(
            "قد نُحدّث هذه السياسة عند تغيّر ممارساتنا أو الأنظمة ذات الصلة، ويظهر تاريخ آخر تحديث ورقم الإصدار في أعلى الصفحة دائمًا.",
            "We may update this policy when our practices or the relevant law change. The date of the last update and the version number are always shown at the top of the page.",
          ),
        },
        {
          ul: [
            t(
              "التصحيحات التحريرية تظهر فورًا مع تحديث التاريخ.",
              "Editorial corrections appear at once, with the date updated.",
            ),
            t(
              "التغييرات الجوهرية نُخطر بها الجهات المتعاقدة قبل نفاذها بمدة لا تقل عن 30 يومًا، حتى يتسنّى لها الاعتراض أو تعديل ترتيباتها.",
              "Material changes reach contracted entities at least 30 days before they take effect, so they can object or adjust their arrangements.",
            ),
            t(
              "يبقى ما تمّ من معالجة قبل التحديث خاضعًا للنسخة التي كانت سارية وقته، ونحفظ الإصدارات السابقة ونتيحها عند الطلب.",
              "Processing carried out before an update stays governed by the version in force at the time; we keep earlier versions and provide them on request.",
            ),
          ],
        },
      ],
    },
    {
      id: "contact",
      title: t("التواصل معنا", "Getting in touch"),
      blocks: [
        {
          p: t(
            "لكل ما يتعلّق بهذه السياسة أو ببياناتك الشخصية — طلب وصول أو تصحيح أو حذف، أو سؤال قبل التعاقد — راسلنا على info@jadawl.site. وللمواضيع الأمنية نستقبل التبليغ على البريد نفسه مع وسم «أمني» في العنوان، ونؤكّد استلامه ونمضي في التحقيق.",
            "For anything about this policy or your personal data — access, correction, deletion, or a question before contracting — write to info@jadawl.site. For security reports, use the same address with \"security\" in the subject; we acknowledge receipt and investigate.",
          ),
        },
      ],
    },
  ],
};
