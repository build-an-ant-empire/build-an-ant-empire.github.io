export const guideStyles = `
.head{height:auto;min-height:76px;gap:16px;flex-wrap:nowrap;padding:12px 0}
.logo{font-size:23px;white-space:nowrap;line-height:1.25}
.nav{min-width:0;flex:1;justify-content:flex-end;gap:2px}
.nav-link{white-space:nowrap;padding:12px 9px;min-height:44px}
.nav-more{position:relative;flex-shrink:0}.nav-more summary{cursor:pointer;list-style:none;font-size:13px;font-weight:800;color:#e7e7e7;display:flex;align-items:center;gap:6px}.nav-more summary::-webkit-details-marker{display:none}.nav-more summary:focus-visible{outline:3px solid #e73749;outline-offset:3px}.nav-more[open] summary{background:#232323}.nav-more-links{position:absolute;right:0;top:100%;z-index:20;min-width:190px;padding:6px;background:#111;border:1px solid #444;border-radius:4px;box-shadow:0 8px 20px #0003}.nav-more-links .nav-link{display:block}
main{min-width:0}h1{line-height:1.13;overflow-wrap:break-word}
.article-head{padding:20px 0 24px;margin-bottom:20px}.article-head h1{font-size:42px;line-height:1.13;margin:0}
.lead-card{min-height:0;padding:26px;justify-content:center}.lead-card p{margin:12px 0;color:#e5e5e5;font-size:18px;line-height:1.65}
.lead-card .kicker{color:#ff9297}.core-loop{font-weight:700}
.hero-actions{display:flex;flex-wrap:wrap;gap:10px;margin:16px 0}.guide-button{background:#c91f2c;color:#fff;border-radius:4px;padding:12px 16px;font-weight:700;min-height:46px;display:inline-flex;align-items:center}.guide-button.secondary{background:#fff;color:#191919}
.quick-links{display:flex;gap:20px;margin-top:12px}.quick-links a{text-decoration:underline;color:#fff;padding:8px 0}
.cover-card{background:#fff;border:1px solid #ddd;border-radius:8px;overflow:hidden;align-self:start}.cover-card img{display:block;width:100%;height:auto;aspect-ratio:16/9;object-fit:cover}.cover-card p{padding:8px 16px;color:#555;font-size:14px}
.grid .article{border-top:3px solid #c91f2c}.article a{display:block;min-height:140px}.article a:hover{background:#fff3f3}.article-body{padding:20px}.article p{font-size:15px}
.guide-content,.body>article{min-width:0;background:#fff;border:1px solid #ddd;border-radius:8px;padding:28px;margin-top:26px}.body>article{margin-top:0}.guide-content>section{max-width:880px}
.guide-content h2,.body article h2{font-size:28px;line-height:1.2;margin:30px 0 14px}.guide-content h3,.body article h3{font-size:20px;line-height:1.3;margin:22px 0 8px}
.guide-content p,.guide-content li,.body article p,.body article li{font-size:17px;line-height:1.8;color:#414141}.guide-content p,.body article p{max-width:78ch}
.guide-content ul,.guide-content ol,.body article ul,.body article ol{padding-left:24px}.guide-content li,.body article li{margin:10px 0}
.guide-content a,.body article a{color:#b01826;text-decoration:underline;text-underline-offset:3px}
section[id]{scroll-margin-top:160px}.context-link{border-left:3px solid #c91f2c;padding:8px 14px;background:#faf5f5}
.table-scroll{max-width:100%;overflow-x:auto;border:1px solid #ddd;border-radius:5px;margin:18px 0;overscroll-behavior-x:contain}
table{border-collapse:collapse;width:100%;font-size:15px;min-width:490px}caption{text-align:left;padding:12px 14px;background:#f7f7f7;font-weight:700}th,td{text-align:left;border-bottom:1px solid #ddd;padding:12px 14px;vertical-align:top}thead{background:#181818;color:#fff}tbody th{font-weight:600}tbody tr:nth-child(even){background:#fafafa}
.quick-answer{border-left:4px solid #c91f2c;background:#fff3f3;padding:14px 20px}.quick-answer p{margin:0;font-weight:600}.checked-date{font-size:13px!important;color:#666!important}
.guide-steps li{padding-left:8px}.guide-steps h3{margin:0!important}.guide-steps p{margin:6px 0 18px}
.mobile-toc{display:none;border:1px solid #ddd;border-radius:4px;padding:12px;margin-top:18px}.mobile-toc summary{font-weight:700;cursor:pointer;min-height:24px}.mobile-toc nav{display:block}.mobile-toc a{display:block;padding:8px 0}
.faq-item{border-top:1px solid #ddd;padding:4px 0 12px}.toc{top:145px}.toc a{padding:9px 0;line-height:1.45}.code-action{padding-top:20px}.code-copy{display:flex;align-items:center;flex-wrap:wrap;gap:12px;background:#fff;padding:14px;border:1px solid #ddd;border-left:4px solid #c91f2c;border-radius:4px}.code-copy code{font-size:22px;font-weight:800;user-select:all}.code-copy button{background:#b01826;color:#fff;padding:12px 16px;border:0;border-radius:4px;font-weight:700;min-height:44px;cursor:pointer}.code-copy span{font-size:14px}
a:focus-visible,button:focus-visible,.table-scroll:focus-visible{outline:3px solid #e73749;outline-offset:3px}
@media(max-width:1100px){.head{display:block}.logo{display:inline-block;margin:0 0 8px}.nav{justify-content:flex-start}.nav-link{flex-shrink:0}.toc{top:155px}}
@media(max-width:600px){.nav{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:2px}.nav>.nav-link,.nav-more summary{font-size:12px;padding:12px 8px;display:flex;align-items:center;justify-content:center}.nav-more[open]{grid-column:1/-1}.nav-more-links{position:static;min-width:0;box-shadow:none;margin-top:4px}.nav-more-links .nav-link{font-size:13px}}
@media(max-width:820px){.body{grid-template-columns:1fr}.toc{display:none}.mobile-toc{display:block}.article-head h1{font-size:34px}.lead-card{padding:20px}.cover-card{display:none}.guide-content,.body>article{padding:20px}.grid{grid-template-columns:1fr 1fr}}
@media(max-width:480px){.grid{grid-template-columns:1fr}.logo{font-size:22px}.guide-content,.body>article{padding:16px}.wrap{width:calc(100% - 24px)}h1{font-size:32px}.article-head h1{font-size:32px}.lead-card p{font-size:16px}.guide-content h2,.body article h2{font-size:25px}.guide-content p,.guide-content li,.body article p,.body article li{font-size:16px}.guide-button{width:100%;justify-content:center}}
`;
