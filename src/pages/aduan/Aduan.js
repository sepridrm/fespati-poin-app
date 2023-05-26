import { SingleEliminationBracket, Match, SVGViewer } from '@g-loot/react-tournament-brackets';
import React, { useEffect, useState } from 'react'
import { UseAuth } from '../../routes/useAuth';
import Select from 'react-select';
import { useNavigate } from "react-router-dom";

import { initializeApp } from 'firebase/app';
import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import { firebaseConfig } from '../../utils/config';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

initializeApp(firebaseConfig());
const db = getFirestore();

// const matches = [
//     //FINAL
//     {
//         id: 15,
//         name: 'Final - Match',
//         nextLooserMatchId: null,
//         nextMatchId: null,
//         participants: [
//             {
//                 id: '4-2',
//                 isWinner: false,
//                 name: 'Nunu',
//                 resultText: '30',
//                 status: null
//             },
//             {
//                 id: '8-2',
//                 isWinner: true,
//                 name: 'Nuni',
//                 resultText: '32',
//                 status: null
//             }
//         ],
//         startTime: null,
//         state: 'SCHEDULED',
//         tournamentRoundText: '4'
//     },
//     //EMI FINAL
//     {
//         id: 13,
//         name: 'Semi Final - Match 1',
//         nextLooserMatchId: null,
//         nextMatchId: 15,
//         participants: [
//             {
//                 id: '2-2',
//                 isWinner: false,
//                 name: 'Nunu',
//                 resultText: '30',
//                 status: null
//             },
//             {
//                 id: '4-2',
//                 isWinner: true,
//                 name: 'Nuni',
//                 resultText: '32',
//                 status: null
//             }
//         ],
//         startTime: null,
//         state: 'SCORE_DONE',
//         tournamentRoundText: '3'
//     },
//     {
//         id: 14,
//         name: 'Semi Final - Match 2',
//         nextLooserMatchId: null,
//         nextMatchId: 15,
//         participants: [
//             {
//                 id: '5-2',
//                 isWinner: false,
//                 name: 'Nunu',
//                 resultText: '30',
//                 status: null
//             },
//             {
//                 id: '8-2',
//                 isWinner: true,
//                 name: 'Nuni',
//                 resultText: '32',
//                 status: null
//             }
//         ],
//         startTime: null,
//         state: 'SCORE_DONE',
//         tournamentRoundText: '3'
//     },
//     //ROUND 2
//     {
//         id: 9,
//         name: 'Round 2 - Match 1',
//         nextLooserMatchId: null,
//         nextMatchId: 13,
//         participants: [
//             {
//                 id: '1-2',
//                 isWinner: false,
//                 name: 'Nunu',
//                 resultText: '30',
//                 status: null
//             },
//             {
//                 id: '2-2',
//                 isWinner: true,
//                 name: 'Nuni',
//                 resultText: '32',
//                 status: null
//             }
//         ],
//         startTime: null,
//         state: 'SCORE_DONE',
//         tournamentRoundText: '2'
//     },
//     {
//         id: 10,
//         name: 'Round 2 - Match 2',
//         nextLooserMatchId: null,
//         nextMatchId: 13,
//         participants: [
//             {
//                 id: '3-2',
//                 isWinner: false,
//                 name: 'Nunu',
//                 resultText: '30',
//                 status: null
//             },
//             {
//                 id: '4-2',
//                 isWinner: true,
//                 name: 'Nuni',
//                 resultText: '32',
//                 status: null
//             }
//         ],
//         startTime: null,
//         state: 'SCORE_DONE',
//         tournamentRoundText: '2'
//     },
//     {
//         id: 11,
//         name: 'Round 2 - Match 3',
//         nextLooserMatchId: null,
//         nextMatchId: 14,
//         participants: [
//             {
//                 id: '5-2',
//                 isWinner: false,
//                 name: 'Nunu',
//                 resultText: '30',
//                 status: null
//             },
//             {
//                 id: '6-2',
//                 isWinner: true,
//                 name: 'Nuni',
//                 resultText: '32',
//                 status: null
//             }
//         ],
//         startTime: null,
//         state: 'SCORE_DONE',
//         tournamentRoundText: '2'
//     },
//     {
//         id: 12,
//         name: 'Round 2 - Match 4',
//         nextLooserMatchId: null,
//         nextMatchId: 14,
//         participants: [
//             {
//                 id: '7-2',
//                 isWinner: false,
//                 name: 'Nunu',
//                 resultText: '30',
//                 status: null
//             },
//             {
//                 id: '8-2',
//                 isWinner: true,
//                 name: 'Nuni',
//                 resultText: '32',
//                 status: null
//             }
//         ],
//         startTime: null,
//         state: 'SCORE_DONE',
//         tournamentRoundText: '2'
//     },
//     //ROUND 1
//     {
//         id: 1,
//         name: 'Round 1 - Match 1',
//         nextLooserMatchId: null,
//         nextMatchId: 9,
//         participants: [
//             {
//                 id: '1-1',
//                 isWinner: false,
//                 name: 'Nono',
//                 resultText: '30',
//                 status: null
//             },
//             {
//                 id: '1-2',
//                 isWinner: true,
//                 name: 'Nunu',
//                 resultText: '32',
//                 status: null
//             }
//         ],
//         startTime: null,
//         state: 'SCORE_DONE',
//         tournamentRoundText: '1'
//     },
//     {
//         id: 2,
//         name: 'Round 1 - Match 2',
//         nextLooserMatchId: null,
//         nextMatchId: 9,
//         participants: [
//             {
//                 id: '2-1',
//                 isWinner: false,
//                 name: 'Nuna',
//                 resultText: '30',
//                 status: null
//             },
//             {
//                 id: '2-2',
//                 isWinner: true,
//                 name: 'Nuni',
//                 resultText: '32',
//                 status: null
//             }
//         ],
//         startTime: null,
//         state: 'SCORE_DONE',
//         tournamentRoundText: '1'
//     },
//     {
//         id: 3,
//         name: 'Round 1 - Match 3',
//         nextLooserMatchId: null,
//         nextMatchId: 10,
//         participants: [
//             {
//                 id: '3-1',
//                 isWinner: false,
//                 name: 'Nanu',
//                 resultText: '30',
//                 status: null
//             },
//             {
//                 id: '3-2',
//                 isWinner: true,
//                 name: 'Ninu',
//                 resultText: '32',
//                 status: null
//             }
//         ],
//         startTime: null,
//         state: 'SCORE_DONE',
//         tournamentRoundText: '1'
//     },
//     {
//         id: 4,
//         name: 'Round 1 - Match 4',
//         nextLooserMatchId: null,
//         nextMatchId: 10,
//         participants: [
//             {
//                 id: '4-1',
//                 isWinner: false,
//                 name: 'Nana',
//                 resultText: '30',
//                 status: null
//             },
//             {
//                 id: '4-2',
//                 isWinner: true,
//                 name: 'Nini',
//                 resultText: '32',
//                 status: null
//             }
//         ],
//         startTime: null,
//         state: 'SCORE_DONE',
//         tournamentRoundText: '1'
//     },
//     {
//         id: 5,
//         name: 'Round 1 - Match 5',
//         nextLooserMatchId: null,
//         nextMatchId: 11,
//         participants: [
//             {
//                 id: '5-1',
//                 isWinner: false,
//                 name: 'Momon',
//                 resultText: '30',
//                 status: null
//             },
//             {
//                 id: '5-2',
//                 isWinner: true,
//                 name: 'Meman',
//                 resultText: '32',
//                 status: null
//             }
//         ],
//         startTime: null,
//         state: 'SCORE_DONE',
//         tournamentRoundText: '1'
//     },
//     {
//         id: 6,
//         name: 'Round 1 - Match 6',
//         nextLooserMatchId: null,
//         nextMatchId: 11,
//         participants: [
//             {
//                 id: '6-1',
//                 isWinner: false,
//                 name: 'Mamen',
//                 resultText: '30',
//                 status: null
//             },
//             {
//                 id: '6-2',
//                 isWinner: true,
//                 name: 'Mumin',
//                 resultText: '32',
//                 status: null
//             }
//         ],
//         startTime: null,
//         state: 'SCORE_DONE',
//         tournamentRoundText: '1'
//     },
//     {
//         id: 7,
//         name: 'Round 1 - Match 7',
//         nextLooserMatchId: null,
//         nextMatchId: 12,
//         participants: [
//             {
//                 id: '7-1',
//                 isWinner: false,
//                 name: 'Mumun',
//                 resultText: '30',
//                 status: null
//             },
//             {
//                 id: '7-2',
//                 isWinner: true,
//                 name: 'Memen',
//                 resultText: '32',
//                 status: null
//             }
//         ],
//         startTime: null,
//         state: 'SCORE_DONE',
//         tournamentRoundText: '1'
//     },
//     {
//         id: 8,
//         name: 'Round 1 - Match 8',
//         nextLooserMatchId: null,
//         nextMatchId: 12,
//         participants: [
//             {
//                 id: '8-1',
//                 isWinner: false,
//                 name: 'Maman',
//                 resultText: '30',
//                 status: null
//             },
//             {
//                 id: '8-2',
//                 isWinner: true,
//                 name: 'Mimin',
//                 resultText: '32',
//                 status: null
//             }
//         ],
//         startTime: null,
//         state: 'SCORE_DONE',
//         tournamentRoundText: '1'
//     },
// ]

const Aduan = (props) => {
    const finalWidth = window.innerWidth - 30;
    const finalHeight = window.innerHeight;

    const [matches, setMatches] = useState([]);
    const [events, setEvents] = useState([]);
    const [kategoris, setKategoris] = useState([]);
    const [selected_kategori, setSelectedKategori] = useState({});
    const [rank, setRank] = useState([]);

    const selected_event = props.selected_event
    const data = props.data

    const navigate = useNavigate();
    const useAuth = UseAuth();

    useEffect(() => {
        grupSkor(data);

        // firestore.getEvent(useAuth.user.collection).then(res => {
        //     const temp = [];
        //     res.forEach(element => {
        //         temp.push(
        //             { label: element.nama_event, value: JSON.stringify(element) },
        //         )
        //     });
        //     setEvents(temp);
        // })
    }, [data])

    // const getSkor = (event) => {
    //     const q = query(collection(db, "skor"), where('id_event', '==', event.collection), orderBy("kode_peserta", "asc"), orderBy("rambahan", "asc"));
    //     onSnapshot(q, (querySnapshot) => {
    //         const data = [];
    //         querySnapshot.forEach((doc) => {
    //             const temp = {
    //                 ...doc.data(),
    //                 collection: doc.id
    //             }
    //             data.push(temp);
    //         });

    //         grupSkor(data);
    //     })
    // }

    const groupBy = function (xs, key) {
        return xs.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    };

    Array.prototype.sum = function (prop) {
        var total = 0
        for (var i = 0, _len = this.length; i < _len; i++) {
            total += this[i][prop]
        }
        return total
    }

    function compareFn(a, b) {
        if (a.total_skor < b.total_skor) {
            return 1;
        }
        if (a.total_skor > b.total_skor) {
            return -1;
        }
        if (a.total_skor === b.total_skor) {
            if (a.total_skor_max1 < b.total_skor_max1) {
                return 1;
            }
            if (a.total_skor_max1 > b.total_skor_max1) {
                return -1;
            }
            if (a.total_skor_max1 === b.total_skor_max1) {
                if (a.total_skor_max2 < b.total_skor_max2) {
                    return 1;
                }
                if (a.total_skor_max2 > b.total_skor_max2) {
                    return -1;
                }
                if (a.total_skor_max2 === b.total_skor_max2) {
                    if (a.total_skor_max3 < b.total_skor_max3) {
                        return 1;
                    }
                    if (a.total_skor_max3 > b.total_skor_max3) {
                        return -1;
                    }
                    return 0;
                }
            }
        }
    }

    const grupSkor = (data) => {
        const grupKategori = groupBy(data, 'kategori');
        const skorKategori = [];
        const listKategori = [];
        Object.keys(grupKategori).forEach((elementKat, index) => {
            let nodes = [];
            const grupPeserta = groupBy(grupKategori[elementKat], 'kode_peserta');
            Object.keys(grupPeserta).forEach(elementPeserta => {
                nodes.push({
                    collection: grupPeserta[elementPeserta][0].collection,
                    tim: grupPeserta[elementPeserta][0].tim,
                    kode_peserta: elementPeserta,
                    nama: grupPeserta[elementPeserta][0].nama,
                    total_skor: grupPeserta[elementPeserta].sum("total_skor_rambahan"),
                    total_skor_max1: grupPeserta[elementPeserta].sum("skor_max1"),
                    total_skor_max2: grupPeserta[elementPeserta].sum("skor_max2"),
                    total_skor_max3: grupPeserta[elementPeserta].sum("skor_max3"),
                    data: grupPeserta[elementPeserta]
                })
            });

            nodes.sort((a, b) => compareFn(a, b))

            nodes.forEach((element, index) => {
                element.rank = index + 1
            });

            skorKategori.push(nodes)
            listKategori.push({ label: elementKat, value: JSON.stringify({ index: index, nama_kategori: elementKat }) });
        });

        setKategoris(listKategori);
        setRank(skorKategori);
    }

    const getAduan = (kategori) => {
        const q = query(collection(db, `aduan`), where("id_event", "==", selected_event.collection), where('nama_kategori', '==', kategori.nama_kategori));
        onSnapshot(q, (querySnapshot) => {
            let data = {};
            querySnapshot.forEach((doc) => {
                const temp = {
                    ...doc.data(),
                    collection: doc.id
                }
                data = temp
            });

            if (!data.aduan) {
                setMatches([])

                return
            }

            const jml_peserta_aduan = selected_event.kategori.find(({ nama_kategori }) => nama_kategori === kategori.nama_kategori).aduan;
            const peserta_aduan = rank[kategori.index].slice(0, jml_peserta_aduan);

            const round = [...data.data];
            const round1 = round.slice((jml_peserta_aduan / 2) - 1, round.length);
            const round2 = round.slice(0, (jml_peserta_aduan / 2) - 1);

            // console.log(round1);
            // console.log(round2);
            // console.log(data.data);
            // console.log(round1);
            // console.log(peserta_aduan);

            const vs = [];
            let temp = [...peserta_aduan];
            for (let index = 0; index < round1.length; index++) {
                const last = temp.length
                const p1 = temp[0];
                const p2 = temp[last - 1];

                vs.push([
                    {
                        id: p1.collection,
                        isWinner: false,
                        name: p1.nama,
                        resultText: null,
                        status: null
                    },
                    {
                        id: p2.collection,
                        isWinner: false,
                        name: p2.nama,
                        resultText: null,
                        status: null
                    }]
                )

                temp = temp.splice(1);
                temp.length = temp.length - 1
            }

            if (jml_peserta_aduan > 8) {
                round1[0].participants = vs[0]
                round1[1].participants = vs[4]
                round1[2].participants = vs[2]
                round1[3].participants = vs[5]
                round1[4].participants = vs[1]
                round1[5].participants = vs[6]
                round1[6].participants = vs[3]
                round1[7].participants = vs[7]
            } else if (jml_peserta_aduan > 4) {
                round1[0].participants = vs[0]
                round1[1].participants = vs[2]
                round1[2].participants = vs[1]
                round1[3].participants = vs[3]
            } else {
                round1[0].participants = vs[0]
                round1[1].participants = vs[1]
            }

            // console.log(vs);

            setMatches([...round1, ...round2]);
        })
    }

    const changeMatch = () => {
    }

    const printDocument = () => {
        const paper = {
            aduan4: [20, 37],
            aduan8: [38, 56],
            aduan16: [72, 74]
        }

        const no = matches.length + 1;
        console.log(paper['aduan' + no]);
        const input = document.getElementById('bagan');
        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('l', 'cm', paper['aduan' + no]);
                pdf.addImage(imgData, 'JPEG', 0, 0);
                pdf.save("Aduan " + selected_kategori.nama_kategori + ".pdf");
            });
    }

    return (
        <>
            {/* <nav className="navbar navbar-expand-lg fixed-top bg-white shadow-sm">
                <div className="container-fluid">
                    <i onClick={() => navigate(-1)} className="fa-sharp fa-solid fa-circle-arrow-left fa-2xl ms-3"></i>
                    <a className="navbar-brand">
                        <img src={logo} width="35" height="35" />
                    </a>
                </div>
            </nav> */}

            <div className="container">
                <img className="logo-1 mt-2" src={process.env.REACT_APP_imageURL.replace('.php', '/') + selected_event.logo} />
                <h6 className='mt-2'>{selected_event.nama_event}</h6>

                {/* <div className="mt-2">
                    <label className="form-label">Event</label>
                    <Select isSearchable placeholder="Pilih Event" options={events} onChange={(element) => (setSelectedEvent(JSON.parse(element.value)), getSkor(JSON.parse(element.value)))} />
                </div> */}

                <div className="mt-2 mb-4">
                    <label className="form-label">Kategori</label>
                    <Select isSearchable placeholder="Pilih Kategori" options={kategoris} onChange={(element) => (setSelectedKategori(JSON.parse(element.value)), getAduan(JSON.parse(element.value)))} />
                </div>
            </div>

            {matches.length > 0 ?
                <>
                    <div className='d-flex flex-row p-2 bg-success align-items-center justify-content-center'>
                        <h6 className='text-white mb-0 ms-2 me-auto'>Kategori {selected_kategori.nama_kategori}</h6>
                        {useAuth.user ?
                            <>
                                <button onClick={() => printDocument()} className="btn btn-sm btn-info px-3 text-white me-2"><i className="fa fa-download"></i></button>
                                {/* <button onClick={() => exportPDF()} className="btn btn-sm btn-info px-3 text-white me-2"><i className="fa fa-print"></i></button> */}
                            </>
                            : null}
                    </div>

                    <div className='d-flex flex-row my-3 align-items-center justify-content-center'>
                        <div id="bagan">
                            <SingleEliminationBracket
                                matches={matches}
                                matchComponent={Match}
                                svgWrapper={({ children, ...props }) => (
                                    <SVGViewer width={finalWidth} height={matches.length > 7 ? finalHeight * 2 : matches.length > 3 ? finalHeight : finalHeight / 2} {...props}>
                                        {children}
                                    </SVGViewer>
                                )}
                            />
                        </div>

                        {/* <div className="row mt-3 w-100">
                            <div className="col-3">
                                <h6>Round 1</h6>
                                {matches.filter(({ name }) => name.includes('Round 1')).map(element => (
                                    <div key={element.id} className='mt-2'>
                                        {element.participants.map(peserta => (
                                            <div key={peserta.id} className="d-flex flex-row align-items-center">
                                                <p className="m-0">{peserta.name}</p>
                                                <input type="number" className="form-control ms-2" value={peserta.resultText} onChange={(event) => null} />
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                            <div className="col-3">
                                <h6>Round 2</h6>
                                {matches.filter(({ name }) => name.includes('Round 2')).map(element => (
                                    <div key={element.id} className='mt-2'>
                                        {element.participants.map(peserta => (
                                            <div key={peserta.id} className="d-flex flex-row align-items-center">
                                                <p className="m-0">{peserta.name}</p>
                                                <input type="number" className="form-control ms-2" value={peserta.resultText} onChange={(event) => null} />
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                            <div className="col-3">
                                <h6>Semi Final</h6>
                                {matches.filter(({ name }) => name.includes('Semi Final')).map(element => (
                                    <div key={element.id} className='mt-2'>
                                        {element.participants.map(peserta => (
                                            <div key={peserta.id} className="d-flex flex-row align-items-center">
                                                <p className="m-0">{peserta.name}</p>
                                                <input type="number" className="form-control ms-2" value={peserta.resultText} onChange={(event) => null} />
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                            <div className="col-3">
                                <h6>Final</h6>
                                {matches.filter(({ name }) => name.includes('Final - Match')).map(element => (
                                    <div key={element.id} className='mt-2'>
                                        {element.participants.map(peserta => (
                                            <div key={peserta.id} className="d-flex flex-row align-items-center">
                                                <p className="m-0">{peserta.name}</p>
                                                <input type="number" className="form-control ms-2" value={peserta.resultText} onChange={(event) => null} />
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div> */}
                    </div>
                </>
                : null}
        </>
    )
}

export default Aduan