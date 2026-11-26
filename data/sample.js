export const date = '18 Mar 2031';
export const rate = 16000;
export const cap = 12000000;
export const topic = 'Harbor Quarter flooding';
export const terms = ['Harbor flood', '#HarborFlood', 'canal drainage'];
export const sources = [
  ['short-video', 'Short video', 30, '♪'], ['microblog', 'Microblog', 28, '⌁'],
  ['community', 'Community', 27, '◉'], ['threads', 'Threads feed', 26, '◎'],
  ['photos', 'Photo feed', 25, '▣'], ['video', 'Video', 24, '▷'],
  ['network', 'Professional', 21, '♧'], ['forum', 'Forum', 19, '☏'],
  ['groups', 'Local groups', 12, '◍'], ['news', 'News', 8, '▤'],
];

const observations = [
  ['Canal footbridge', 'A walker notes that water reached the first painted marker before it receded.'],
  ['Market loading lane', 'A market volunteer compares the marked loading lane before and after a short closure.'],
  ['East basin', 'A sketch traces how runoff crossed the boardwalk at the east basin.'],
  ['Blue tram stop', 'A rider shares the posted detour and a description of the queue.'],
  ['Harbor Square', 'A resident says the square reopened after debris was moved from the grate.'],
  ['Library ramp', 'A comment records the alternate entrance while the lower ramp was wet.'],
  ['North quai', 'A cyclist notes which part of the temporary route was accessible.'],
  ['Wetland walk', 'An update describes the water level against the walkway’s colored posts.'],
  ['Ferry approach', 'A neighborhood thread compares two views of the ferry approach after the rain.'],
  ['Lantern alley', 'A volunteer describes pooling near the bins and the dry path on the west side.'],
  ['Pavilion steps', 'An observer shares a measured time for reopening the lower pavilion steps.'],
  ['Station plaza', 'A post credits the clean-up team and asks for a clearer route sign.'],
];
const notes = ['The note includes an approximate observation time.', 'The account asks for a clearer status update.', 'The entry identifies the nearest public crossing.', 'The post compares the situation with the following dry period.', 'The note distinguishes the closed lane from the open route.'];
const outlets = ['Quay Bulletin', 'Harbor Desk', 'Basin Review', 'Transit Weekly'];
export const posts = sources.flatMap(([source, label, count], group) => Array.from({length: count}, (_, row) => {
  const seq = group * 40 + row + 1;
  const [place, observation] = observations[(row + group * 3) % observations.length];
  const edition = source === 'news' ? outlets[row % outlets.length] : `Sample contributor ${String(seq).padStart(3, '0')}`;
  return {id: `S-${String(seq).padStart(3, '0')}`, source, label, edition,
    title: `${place}: ${source === 'news' ? 'local coverage' : ['rain update', 'route note', 'reopening watch'][row % 3]}`,
    text: `${observation} ${notes[(row * 2 + group) % notes.length]}`,
    order: row * 10 + group, score: 18 + (seq * 13) % 72,
    day: `${18 - row % 6} Mar`, tone: ['Negative', 'Neutral', 'Positive', 'Negative', 'Neutral'][(row + group) % 5]};
}));

export const issues = [
  {id:'flood', name:'Harbor Quarter flooding', status:'Watch', score:48, mentions:15720, reach:'3.6M', reposts:31440, sentiment:-36, velocity:42, interval:'every 2 h', tracks:['Harbor Quarter flooding','#HarborQuarter','Harbor Quarter drainage','canal walkway','@harbor-sample','@quay-sample']},
  {id:'traffic', name:'Quay bridge traffic', status:'Escalate', score:76, mentions:18600, reach:'4.1M', reposts:37200, sentiment:-49, velocity:65, interval:'every 45 min', tracks:['quay bridge traffic','tram detour']},
  {id:'accounts', name:'Sample brand accounts', status:'Calm', score:24, mentions:5240, reach:'1.2M', reposts:10480, sentiment:14, velocity:17, interval:'every 20 min', tracks:['@harbor-sample','@quay-sample','@marsh-sample']},
  {id:'homes', name:'Marshlight Homes price talk', status:'Calm', score:27, mentions:3080, reach:'0.7M', reposts:6160, sentiment:7, velocity:12, interval:'every 8 h', tracks:['Marshlight Homes','sample reservation']},
  {id:'launch', name:'Lantern Point launch chatter', status:'Calm', score:33, mentions:4120, reach:'0.9M', reposts:8240, sentiment:11, velocity:21, interval:'every 4 h', tracks:['Lantern Point','sample launch']},
];

export const daySpend = [[125000,92000],[185000,82000],[473000,221000],[526000,260000],[379000,240000],[212000,105000]];
export const researchSpend = daySpend.reduce((total, [amount]) => total + amount, 0);
export const collectorSpend = daySpend.reduce((total, [, amount]) => total + amount, 0);
export const monthSpend = researchSpend + collectorSpend;
export const baseRun = {id:'DEMO-310318-0001', topic, depth:'Scan', cap:18000, spent:14400, time:'18 Mar 11:30', kind:'Sample', status:'Complete', owner:'Demo Analyst'};
export const history = [
  ['DEMO-R-008','Sample','Harbor Quarter access',280000,243200,'Complete','Demo Analyst','18 Mar 09:20'],
  ['DEMO-C-007','Collector','Harbor Quarter flooding · topic sweep',8500,5100,'Complete','Sample schedule','18 Mar 10:00'],
  ['DEMO-C-006','Collector','Quay bridge traffic',6500,3900,'Complete','Sample schedule','18 Mar 10:45'],
  ['DEMO-R-005','Sample','Marshlight Homes reservations',62000,22400,'Stopped','Sample Editor','18 Mar 08:45'],
  ['DEMO-C-004','Collector','Sample brand accounts',4500,2700,'Complete','Sample schedule','18 Mar 10:20'],
  ['DEMO-R-003','Sample','Quay bridge detour',44000,42800,'Stopped at cap','Demo Analyst','17 Mar 17:15'],
  ['DEMO-R-002','Sample','Lantern Point preview',120000,73600,'Complete','Sample Reviewer','17 Mar 14:20'],
  ['DEMO-C-001','Collector','Harbor Quarter flooding · rain watch',5000,4800,'Complete','Sample schedule','17 Mar 07:40'],
].map(([id,kind,topic,cap,spent,status,owner,time]) => ({id,kind,topic,cap,spent,status,owner,time}));

export const people = [
  ['Demo Analyst','analyst','Admin','Active','Sample setup','12 Mar 09:20','19 Mar 08:45'],
  ['Sample Editor','editor','Admin','Active','Demo Analyst','13 Mar 10:15','18 Mar 17:30'],
  ['Sample Guest','guest','User','Disabled','Demo Analyst','13 Mar 10:25','15 Mar 16:40'],
  ['Sample Reviewer','reviewer','User','Active','Demo Analyst','14 Mar 14:45','19 Mar 07:50'],
  ['Sample Observer','observer','User','Active','Sample Editor','15 Mar 11:35','Never'],
].map(([name,handle,role,status,by,added,last]) => ({name,email:`${handle}@example.invalid`,role,status,by,added,last}));
export const accessChanges = [
  ['16 Mar 13:10',people[0].name,`Disabled ${people[2].email}`],
  [people[4].added,people[1].name,`Added ${people[4].email} as user`],
  [people[3].added,people[0].name,`Added ${people[3].email} as user`],
  [people[1].added,people[0].name,`Added ${people[1].email} as admin`],
];

export const reportSections = {
  en: [
    ['Cover','Harbor Quarter flooding','Fictional desk brief for the Sample Mode review.'],
    ['Contents','How to read this brief','Start with the summary, then follow the evidence, implications and action plan.'],
    ['Executive summary','Rain disrupted several routes, then water receded','Prioritize route signs and a clear status update. The 220-card replay is a fictional evidence set.'],
    ['Method','How the sample was constructed','The replay groups 212 generated social entries and eight generated news items across ten sample sources.'],
    ['Event timeline','Closures were short and uneven','The canal footbridge and market lane use separate observation times in the exercise.'],
    ['Visual evidence','Where the example observations sit','A diagram summarizes the fictional canal, footbridge, station plaza and market approach.'],
    ['Causes and spread','Two observation clusters drove the discussion','The scenario combines water near crossing points with uncertainty about alternative routes.'],
    ['Viral performance','Reopening updates traveled across several source types','Score and rank are generated for the demonstration and support sorting the replay.'],
    ['Community accounts','Route availability is a recurring theme','Generated contributor notes focus on signs, detours, reopening times and accessible approaches.'],
    ['Public statements','A single sample update can consolidate the next steps','Publish one route status, list the alternatives and time-stamp the next expected update.'],
    ['Impact and risk','Conflicting route instructions are the main sample risk','Separate actual closure notices within the exercise from assumptions about future disruption.'],
    ['Action plan','Check signs first, then validate the reopening summary','Review each access point, mark alternate routes and record a fictional completion time.'],
    ['Source appendix','The evidence entries use local sample identifiers','Every card is synthetic and assigned a sample ID. The brief has zero external sources.'],
  ],
  id: [
    ['Sampul','Genangan di Harbor Quarter','Ringkasan rekaan untuk peninjauan Mode Sampel.'],
    ['Daftar isi','Cara membaca ringkasan ini','Mulai dari ikhtisar, lalu baca bukti, dampak, dan rencana aksi.'],
    ['Ringkasan eksekutif','Hujan mengganggu beberapa rute sebelum air surut','Utamakan rambu dan pembaruan status yang jelas. Kumpulan 220 kartu ini sepenuhnya rekaan.'],
    ['Metode','Cara menyusun sampel','Terdapat 212 entri sosial dan delapan berita rekaan dari sepuluh sumber sampel.'],
    ['Linimasa','Durasi penutupan berbeda-beda','Jembatan pejalan kaki dan jalur pasar memiliki waktu pengamatan yang berbeda dalam latihan ini.'],
    ['Bukti visual','Lokasi pengamatan contoh','Diagram merangkum kanal, jembatan, plaza stasiun, dan jalur pasar dalam skenario rekaan.'],
    ['Penyebab dan penyebaran','Dua kelompok pengamatan memicu diskusi','Skenario menggabungkan genangan di dekat penyeberangan dan ketidakpastian tentang jalur alternatif.'],
    ['Jangkauan','Pembaruan pembukaan tersebar di beberapa jenis sumber','Skor dan peringkat dibuat untuk demonstrasi dan mendukung pengurutan kartu.'],
    ['Catatan warga','Ketersediaan rute menjadi tema berulang','Catatan rekaan membahas rambu, pengalihan, waktu pembukaan, dan jalur akses.'],
    ['Pernyataan publik','Satu pembaruan contoh dapat merangkum langkah berikutnya','Tampilkan status, jalur alternatif, dan jadwal pembaruan berikutnya.'],
    ['Dampak dan risiko','Petunjuk yang bertentangan menjadi risiko utama','Pisahkan pemberitahuan penutupan dalam latihan dari dugaan gangguan mendatang.'],
    ['Rencana aksi','Periksa rambu, lalu validasi ringkasan pembukaan','Tinjau setiap titik akses, tandai jalur alternatif, dan catat waktu selesai rekaan.'],
    ['Lampiran sumber','Entri bukti memakai pengenal sampel lokal','Semua kartu dibuat secara sintetis. Ringkasan ini tidak memiliki sumber eksternal.'],
  ],
};
