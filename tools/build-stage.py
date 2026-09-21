#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generates the platform-stage section and writes it into src/pages/index.html.

Everything the section renders is HTML, CSS or inline SVG: one sprite holds the
five segment illustrations and every UI glyph, so nothing repeats and no raster
image is involved. Run after editing the copy here.

    python3 tools/build-stage.py
"""
import json
import re

# The map field behind the headline. This is the Natural Earth 1:110m
# admin-0 outline for Saudi Arabia (public domain, naturalearthdata.com),
# projected equirectangular with a cos(mean latitude) correction and rounded
# to one decimal place. It is embedded rather than fetched so the section
# rebuilds offline and the shape never drifts between builds.
SAUDI_BOX = "0 0 1000 751.8"
SAUDI_PATH = (
    "M15.4 121.8 68.3 128.7 88.8 115.3 100.2 99.7 136.5 93.7 144.3 79.1 160.0 71.7 112.7 28.3 207.9 6.5 216.9 0.0 274.2 11.8 345.0 42.2 479.1 129.5 567.5 132.9 609.8 137.1 621.7 157.8 655.3 156.7 673.9 194.1 697.3 204.1 705.4 219.3 737.8 237.6 740.7 255.5 736.0 269.9 742.0 284.5 755.7 296.7 762.0 310.9 769.1 321.6 783.5 330.2 796.7 327.1 805.7 343.7 807.5 353.7 825.7 397.7 968.6 419.6 978.2 410.4 1000.0 441.2 968.3 528.0 825.7 571.4 688.6 588.1 644.2 607.6 610.2 653.2 588.0 660.4 576.1 646.0 557.9 648.1 511.9 643.8 503.2 639.4 448.3 640.4 435.4 644.4 415.9 633.1 403.3 654.4 408.2 672.7 387.3 686.6 381.2 668.0 366.8 655.0 363.1 637.6 338.6 622.1 313.3 585.7 299.8 550.3 267.0 520.4 245.8 513.3 214.3 471.9 208.8 441.7 210.8 416.0 183.5 367.9 161.2 350.9 135.6 341.9 119.9 317.1 122.5 307.2 109.3 284.7 95.4 275.0 76.9 242.7 47.9 207.7 23.7 177.9 0.0 178.1 7.4 154.3 9.5 139.1 15.4 121.8Z"
)

# ---------------------------------------------------------------- illustrations
SPRITE = f'''
      <svg class="sprite" aria-hidden="true" width="0" height="0" focusable="false">
        <defs>
          <symbol id="art-gov" viewBox="0 0 48 48">
            <rect x="8" y="39" width="32" height="3.4" rx="1.2" fill="#bfd6fe"/>
            <rect x="11" y="35" width="26" height="3.4" rx="1.2" fill="#e6eeff"/>
            <rect x="12" y="21" width="3.6" height="14" rx=".8" fill="#0059fc"/>
            <rect x="19" y="21" width="3.6" height="14" rx=".8" fill="#0059fc"/>
            <rect x="26" y="21" width="3.6" height="14" rx=".8" fill="#0059fc"/>
            <rect x="33" y="21" width="3.6" height="14" rx=".8" fill="#0059fc"/>
            <path d="M12.6 19.4h23.4c-1.3-4.9-5.4-8.9-11.7-11.6-6.3 2.7-10.4 6.7-11.7 11.6z" fill="#0059fc"/>
            <rect x="11" y="18.2" width="26.5" height="3" rx="1.2" fill="#0046c7"/>
            <path d="M23.4 7.6V3.2" stroke="#0b0f19" stroke-width="1.3" stroke-linecap="round"/>
            <path d="M23.9 2.4h5.4l-1.7 2 1.7 2h-5.4z" fill="#83d7c2"/>
          </symbol>

          <symbol id="art-shop" viewBox="0 0 48 48">
            <rect x="7.5" y="21" width="33" height="18" rx="2" fill="#e6eeff"/>
            <rect x="13" y="27" width="10" height="12" rx="1" fill="#ffffff"/>
            <rect x="27" y="27" width="9" height="7.5" rx="1" fill="#0059fc"/>
            <path d="M5.5 11.5h37l-3 8.6H8.5z" fill="#0059fc"/>
            <path d="M5.5 11.5h9.2v8.6H8.5zM23.9 11.5h9.2l3 8.6H23.9z" fill="#ffffff" opacity=".38"/>
            <rect x="19.5" y="32.5" width="1.6" height="6.5" rx=".8" fill="#94a6d0"/>
          </symbol>

          <symbol id="art-mid" viewBox="0 0 48 48">
            <rect x="10" y="9" width="19" height="30" rx="2" fill="#0059fc"/>
            <rect x="30" y="21" width="9" height="18" rx="2" fill="#bfd6fe"/>
            <g fill="#ffffff" opacity=".85">
              <rect x="13" y="14" width="4.6" height="3.4" rx="1"/>
              <rect x="20.4" y="14" width="4.6" height="3.4" rx="1"/>
              <rect x="13" y="21" width="4.6" height="3.4" rx="1"/>
              <rect x="20.4" y="21" width="4.6" height="3.4" rx="1"/>
              <rect x="13" y="28" width="4.6" height="3.4" rx="1"/>
              <rect x="20.4" y="28" width="4.6" height="3.4" rx="1"/>
            </g>
            <g fill="#0059fc" opacity=".55">
              <rect x="32.4" y="25" width="4.2" height="3" rx="1"/>
              <rect x="32.4" y="31" width="4.2" height="3" rx="1"/>
            </g>
            <rect x="8" y="39" width="33" height="3" rx="1.2" fill="#e6eeff"/>
          </symbol>

          <symbol id="art-tower" viewBox="0 0 48 48">
            <rect x="7" y="16" width="10.5" height="23" rx="1.6" fill="#8cb4fe"/>
            <rect x="18.6" y="7" width="10.8" height="32" rx="1.6" fill="#0059fc"/>
            <rect x="30.5" y="13" width="10.5" height="26" rx="1.6" fill="#bfd6fe"/>
            <g fill="#ffffff" opacity=".8">
              <rect x="21" y="11.5" width="6" height="2.6" rx=".8"/>
              <rect x="21" y="17" width="6" height="2.6" rx=".8"/>
              <rect x="21" y="22.5" width="6" height="2.6" rx=".8"/>
              <rect x="21" y="28" width="6" height="2.6" rx=".8"/>
            </g>
            <g fill="#ffffff" opacity=".6">
              <rect x="9.6" y="20" width="5.4" height="2.4" rx=".8"/>
              <rect x="9.6" y="25" width="5.4" height="2.4" rx=".8"/>
              <rect x="9.6" y="30" width="5.4" height="2.4" rx=".8"/>
              <rect x="33" y="17" width="5.4" height="2.4" rx=".8"/>
              <rect x="33" y="22" width="5.4" height="2.4" rx=".8"/>
              <rect x="33" y="27" width="5.4" height="2.4" rx=".8"/>
            </g>
            <rect x="5" y="39" width="38" height="3" rx="1.2" fill="#e6eeff"/>
          </symbol>

          <symbol id="art-sector" viewBox="0 0 48 48">
            <g fill="none" stroke="#0059fc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 6v9M11 15l-4 6M11 15l4 6"/>
              <path d="M22 13h4l2.4 4-4.4 2.6L20 17z"/>
              <path d="M33 11v14M33 25c3 0 3.4-3.4 4.6-5M33 25c-3 0-3.4-3.4-4.6-5"/>
              <path d="M9 31.4l2.6 2.6 4.4-5M20 33h8"/>
              <path d="M30 34l4-4 4 4M34 30v9"/>
              <path d="M8 40h10v5H8zM13 40v-3"/>
            </g>
          </symbol>

          <symbol id="ic-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.4"/><path d="M15.6 15.6 20 20"/></symbol>
          <symbol id="ic-filter" viewBox="0 0 24 24"><path d="M3.5 5.5h17l-6.6 7.4V20l-3.8-2.2v-4.9z"/></symbol>
          <symbol id="ic-more" viewBox="0 0 24 24"><circle cx="12" cy="5.5" r="1.6" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="12" cy="18.5" r="1.6" fill="currentColor" stroke="none"/></symbol>
          <symbol id="ic-grid" viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="7.4" height="7.4" rx="1.4"/><rect x="13.1" y="3.5" width="7.4" height="7.4" rx="1.4"/><rect x="3.5" y="13.1" width="7.4" height="7.4" rx="1.4"/><rect x="13.1" y="13.1" width="7.4" height="7.4" rx="1.4"/></symbol>
          <symbol id="ic-db" viewBox="0 0 24 24"><ellipse cx="12" cy="6" rx="7.6" ry="3"/><path d="M4.4 6v12c0 1.7 3.4 3 7.6 3s7.6-1.3 7.6-3V6M4.4 12c0 1.7 3.4 3 7.6 3s7.6-1.3 7.6-3"/></symbol>
          <symbol id="ic-chart" viewBox="0 0 24 24"><path d="M5 20V11M10 20V5M15 20v-8M20 20v-4"/></symbol>
          <symbol id="ic-user" viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.8"/><path d="M4.5 20.5c0-3.9 3.4-6.4 7.5-6.4s7.5 2.5 7.5 6.4"/></symbol>
          <symbol id="ic-sectors" viewBox="0 0 24 24"><circle cx="7.6" cy="7.6" r="3.6"/><rect x="13.4" y="4" width="7.2" height="7.2" rx="1.6"/><rect x="3.4" y="13.4" width="7.2" height="7.2" rx="1.6"/><path d="M17 13.6a3.6 3.6 0 0 1 0 7.2"/></symbol>
          <symbol id="ic-cog" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.6v3M12 18.4v3M2.6 12h3M18.4 12h3M5.4 5.4l2.1 2.1M16.5 16.5l2.1 2.1M18.6 5.4l-2.1 2.1M7.5 16.5l-2.1 2.1"/></symbol>
          <symbol id="ic-building" viewBox="0 0 24 24"><path d="M4 21V7.5L12 3l8 4.5V21M4 21h16M9.5 21v-5.5h5V21"/></symbol>
          <symbol id="ic-store" viewBox="0 0 24 24"><path d="M4 21V10h16v11M4 21h16M8 10V6h8v4M10.5 21v-5h3v5"/></symbol>
          <symbol id="ic-box" viewBox="0 0 24 24"><path d="M3.5 8.2 12 4l8.5 4.2v7.6L12 20l-8.5-4.2zM3.5 8.2 12 12.4l8.5-4.2M12 12.4V20"/></symbol>
          <symbol id="ic-doc" viewBox="0 0 24 24"><path d="M6 3h7.5L19 8.5V21H6zM13.5 3v5.5H19M9 13h7M9 17h5"/></symbol>
          <symbol id="ic-people" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.2"/><path d="M2.8 20c0-3.3 2.8-5.4 6.2-5.4s6.2 2.1 6.2 5.4M15.6 5.2a3.2 3.2 0 0 1 0 6M17 14.9c2.4.5 4.2 2.2 4.2 5.1"/></symbol>
          <symbol id="ic-pin" viewBox="0 0 24 24"><path d="M12 21.5s7-6.3 7-11.3A7 7 0 0 0 5 10.2c0 5 7 11.3 7 11.3z"/><circle cx="12" cy="10" r="2.6"/></symbol>
          <symbol id="ic-server" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="6" rx="2"/><rect x="3" y="14" width="18" height="6" rx="2"/><path d="M7 7h.01M7 17h.01"/></symbol>
          <symbol id="ic-shield" viewBox="0 0 24 24"><path d="M12 2.8 20 6v6c0 5-3.4 8.2-8 9.2-4.6-1-8-4.2-8-9.2V6z"/><path d="M8.8 12.2l2.3 2.3 4.1-4.6"/></symbol>
        </defs>
      </svg>
'''

# ------------------------------------------------------------------- content
# Table rows: type icon, copy key, Arabic project name, org icon, state, date.
# The Arabic is written inline so the section paints without waiting for JS.
ROWS = [
    ("ic-building", "r1", "منصّة الخدمات الموحّدة", "ic-grid", "on", "2026/10/01"),
    ("ic-store", "r2", "ربط الفروع بالشبكة", "ic-store", "review", "2026/10/05"),
    ("ic-box", "r3", "مؤشرات الأداء التنفيذية", "ic-building", "done", "2026/10/12"),
    ("ic-doc", "r4", "أتمتة طلبات الموافقات", "ic-user", "rejected", "2026/10/18"),
    ("ic-people", "r5", "سجل المتدربين", "ic-grid", "progress", "2026/10/20"),
]

STATE = {
    "on": ("نشط", "chip-mint"),
    "review": ("قيد المراجعة", "chip-amber"),
    "done": ("مكتمل", "chip-plain"),
    "rejected": ("مرفوض", "chip-coral"),
    "progress": ("قيد المعالجة", "chip-amber"),
}

# key -> art symbol, Arabic title, Arabic sub-line
SEGMENTS = [
    ("gov", "art-gov", "الجهات الحكومية", "بيانات تدعم اتخاذ القرار"),
    ("small", "art-shop", "المنشآت الصغيرة", "فرص أكبر لنمو أعمالك"),
    ("medium", "art-mid", "المنشآت المتوسطة", "بيانات موثوقة للتوسّع"),
    ("large", "art-tower", "المنشآت والمؤسسات الكبيرة", "رؤية أشمل لقرارات أدق"),
    ("spec", "art-sector", "القطاعات المتخصّصة", "بيانات مخصّصة لكل قطاع"),
]

def card(key, art, title, sub):
    return f'''            <article class="seg-card reveal">
              <span class="seg-art" aria-hidden="true"><svg viewBox="0 0 48 48"><use href="#{art}"></use></svg></span>
              <span class="seg-copy">
                <b data-i18n="stage.{key}t">{title}</b>
                <span data-i18n="stage.{key}s">{sub}</span>
              </span>
            </article>'''


def by_key(k):
    return next(s for s in SEGMENTS if s[0] == k)


rows_html = "\n".join(
    f'''                        <tr>
                          <td class="c-check"><span class="box{' tick' if i == 2 else ''}"></span></td>
                          <td class="c-type"><span class="ty"><svg viewBox="0 0 24 24"><use href="#{ty}"></use></svg></span></td>
                          <td data-i18n="stage.{key}">{name}</td>
                          <td class="c-org"><span class="og"><svg viewBox="0 0 24 24"><use href="#{org}"></use></svg></span></td>
                          <td class="c-state"><span class="chip {STATE[st][1]}" data-i18n="stage.st.{st}">{STATE[st][0]}</span></td>
                          <td class="c-date date" dir="ltr">{date}</td>
                        </tr>'''
    for i, (ty, key, name, org, st, date) in enumerate(ROWS)
)

SECTION = f'''      <!-- ================= 01 Platform stage ================= -->
      <section class="section section-cloud stage-section" id="segments">
{SPRITE}
        <div class="shell stage-shell">
          <div class="stage-bloom" aria-hidden="true"></div>

          <svg class="stage-map" viewBox="{SAUDI_BOX}" aria-hidden="true" focusable="false">
            <path d="{SAUDI_PATH}"></path>
          </svg>

          <h2 class="stage-title reveal" data-i18n="stage.title">منصّة بيانات سعودية للأعمال</h2>

          <div class="stage">
            <div class="stage-side">
{card(*by_key("gov"))}

{card(*by_key("small"))}

{card(*by_key("medium"))}
            </div>

            <div class="appwin reveal">
              <div class="appwin-top">
                <span class="appwin-new"><i aria-hidden="true">+</i><span data-i18n="stage.new">جديد</span></span>
                <span class="appwin-ic" aria-hidden="true"><svg viewBox="0 0 24 24"><use href="#ic-more"></use></svg></span>
                <span class="appwin-ic" aria-hidden="true"><svg viewBox="0 0 24 24"><use href="#ic-filter"></use></svg></span>
                <span class="appwin-search">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#ic-search"></use></svg>
                  <span data-i18n="stage.search">البحث في البيانات..</span>
                </span>
              </div>
              <div class="appwin-body">
                <nav class="appwin-side" aria-hidden="true">
                  <span class="is-active"><svg viewBox="0 0 24 24"><use href="#ic-grid"></use></svg><span data-i18n="stage.n1">المشاريع</span></span>
                  <span><svg viewBox="0 0 24 24"><use href="#ic-db"></use></svg><span data-i18n="stage.n2">البيانات</span></span>
                  <span><svg viewBox="0 0 24 24"><use href="#ic-chart"></use></svg><span data-i18n="stage.n3">المؤشرات</span></span>
                  <span><svg viewBox="0 0 24 24"><use href="#ic-user"></use></svg><span data-i18n="stage.n4">المستخدمون</span></span>
                  <span><svg viewBox="0 0 24 24"><use href="#ic-sectors"></use></svg><span data-i18n="stage.n5">القطاعات</span></span>
                  <span><svg viewBox="0 0 24 24"><use href="#ic-cog"></use></svg><span data-i18n="stage.n6">الإعدادات</span></span>
                </nav>
                <div class="appwin-table">
                  <div class="appwin-scroll">
                    <table class="apptbl">
                      <caption class="sr-only" data-i18n="stage.caption">جدول المشاريع في منصّة جداول</caption>
                      <colgroup>
                        <col class="c-check" /><col class="c-type" /><col /><col class="c-org" /><col class="c-state" /><col class="c-date" />
                      </colgroup>
                      <thead>
                        <tr>
                          <th class="c-check"><span class="box"></span></th>
                          <th class="c-type" aria-hidden="true"></th>
                          <th data-i18n="stage.h1">المشروع</th>
                          <th class="c-org" data-i18n-attr="aria-label:stage.h2" aria-label="الجهة"></th>
                          <th class="c-state" data-i18n="stage.h3">الحالة</th>
                          <th class="c-date" data-i18n="stage.h4">تاريخ التحديث</th>
                        </tr>
                      </thead>
                      <tbody>
{rows_html}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div class="stage-side stage-side--end">
{card(*by_key("large"))}

{card(*by_key("spec"))}
            </div>
          </div>

          <ul class="trust-strip reveal">
            <li class="trust-item">
              <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#ic-pin"></use></svg>
              <span>
                <b data-i18n="stage.t1b">سحابي داخل المملكة</b>
                <span data-i18n="stage.t1s">بياناتك في بلدك</span>
              </span>
            </li>
            <li class="trust-item">
              <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#ic-server"></use></svg>
              <span>
                <b><span class="ltr">On-premises</span></b>
                <span data-i18n="stage.t2s">للمؤسسات الكبرى</span>
              </span>
            </li>
            <li class="trust-item">
              <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#ic-shield"></use></svg>
              <span>
                <b><span class="ltr">2FA</span> <span data-i18n="stage.t3b">وتشفير</span></b>
                <span data-i18n="stage.t3s">أمان على أعلى مستوى</span>
              </span>
            </li>
          </ul>

        </div>
      </section>
'''

# ------------------------------------------------------------------- patch
p = 'src/pages/index.html'
s = open(p, encoding='utf-8').read()
# Locate the stage by its own marker, never by a section number: the numbering
# changed once already, and matching on it made this rewrite the section that
# happened to hold that number instead.
marker = re.search(r'      <!-- =+ \d+ Platform stage =+ -->', s)
if not marker:
    raise SystemExit('build-stage.py: no "Platform stage" marker found in src/pages/index.html')
start = marker.start()
end = s.index('      <!-- ================= 0', start + len(marker.group(0)))
if s.count(marker.group(0)) != 1:
    raise SystemExit('build-stage.py: more than one "Platform stage" marker found; refusing to guess')
# The region must actually be the stage before anything is replaced.
region = s[start:end]
if 'id="segments"' not in region or 'class="appwin' not in region:
    raise SystemExit('build-stage.py: the region after the marker is not the platform stage; refusing to rewrite it')
s = s[:start] + SECTION + '\n' + s[end:]
open(p, 'w', encoding='utf-8').write(s)
print('stage section written:', len(SECTION), 'bytes of markup')
