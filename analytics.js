/* chuverleaf 랜딩 — Mixpanel 웹 분석 (유입·이탈 트래킹)
   ※ MIXPANEL_TOKEN 이 비어 있으면 아무 것도 하지 않음 → 토큰 없이 배포해도 안전.
   ※ 로더는 Mixpanel 공식 스니펫(스텁 큐잉 방식) — 라이브러리 로드 전 호출도
      큐에 쌓였다가 실행되므로 window.mixpanel 미정의로 조용히 죽는 문제가 없다.
   ※ 켜지는 것: autocapture(페이지뷰·클릭·스크롤·폼) + 세션 리플레이(100%) + 히트맵
      + 명명 이벤트 cta_click(구매 버튼) / checkout_click(주문서·결제 링크 클릭).
   ※ 개인정보: 입력값(input)·버튼 텍스트 수집 OFF. 수집 고지는 privacy.html 1·4절. */
(function () {
  "use strict";
  var MIXPANEL_TOKEN = "be6119e91050c0fdde7a2388ed304cd5"; /* chuverleaf 프로젝트 토큰 */

  if (!/^[0-9a-f]{28,40}$/i.test(MIXPANEL_TOKEN)) return; /* 토큰 없음 → 비활성 */

  /* ── Mixpanel 공식 로더 스니펫 (2.x) — window.mixpanel 스텁 생성 + 라이브러리 async 로드 ── */
  (function (f, b) {
    if (!b.__SV) {
      var e, g, i, h;
      window.mixpanel = b;
      b._i = [];
      b.init = function (e, f, c) {
        function g(a, d) {
          var b = d.split(".");
          2 == b.length && ((a = a[b[0]]), (d = b[1]));
          a[d] = function () {
            a.push([d].concat(Array.prototype.slice.call(arguments, 0)));
          };
        }
        var a = b;
        "undefined" !== typeof c ? (a = b[c] = []) : (c = "mixpanel");
        a.people = a.people || [];
        a.toString = function (a) {
          var d = "mixpanel";
          "mixpanel" !== c && (d += "." + c);
          a || (d += " (stub)");
          return d;
        };
        a.people.toString = function () {
          return a.toString(1) + ".people (stub)";
        };
        i = "disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");
        for (h = 0; h < i.length; h++) g(a, i[h]);
        var j = "set set_once union unset remove delete".split(" ");
        a.get_group = function () {
          function b(c) {
            d[c] = function () {
              call2_args = arguments;
              call2 = [c].concat(Array.prototype.slice.call(call2_args, 0));
              a.push([e, call2]);
            };
          }
          for (
            var d = {}, e = ["get_group"].concat(Array.prototype.slice.call(arguments, 0)), c = 0;
            c < j.length;
            c++
          )
            b(j[c]);
          return d;
        };
        b._i.push([e, f, c]);
      };
      b.__SV = 1.2;
      e = f.createElement("script");
      e.type = "text/javascript";
      e.async = !0;
      e.src = "https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";
      g = f.getElementsByTagName("script")[0];
      g.parentNode.insertBefore(e, g);
    }
  })(document, window.mixpanel || []);

  mixpanel.init(MIXPANEL_TOKEN, {
    autocapture: {
      pageview: "full-url", /* 페이지뷰(쿼리 포함 — UTM 추적) */
      click: true,          /* 어떤 요소를 눌렀는지 */
      scroll: true,         /* 어디까지 읽고 이탈하는지 */
      submit: true,
      input: false,         /* 입력 내용은 수집 안 함 */
      capture_text_content: false
    },
    record_sessions_percent: 100, /* 세션 리플레이 — 트래픽 적은 초기엔 전량 기록 */
    record_heatmap_data: true,
    persistence: "localStorage"
  });
  mixpanel.register({ site_lang: document.documentElement.lang || "ko" });

  /* 구매 퍼널 명명 이벤트 — 버튼 구조는 index.html CHUVERLEAF_CONFIG 참고 */
  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a") : null;
    if (!a) return;
    var href = a.getAttribute("href") || "";
    var meta = { href: href, id: a.id || "", lang: document.documentElement.lang || "ko" };
    if (/forms\.gle|docs\.google\.com\/forms|polar\.sh/i.test(href)) {
      mixpanel.track("checkout_click", meta);      /* 주문서(구글폼)/Polar 결제로 이동 */
    } else if (a.classList.contains("btn-buy") || a.classList.contains("nav-cta")) {
      mixpanel.track("cta_click", meta);           /* 페이지 내 구매 CTA 클릭 */
    }
  }, true);
})();
