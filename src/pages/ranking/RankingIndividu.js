import { useEffect, useState } from 'react';
import Select from 'react-select';
import jsPDF from "jspdf";
import "jspdf-autotable";
import { downloadExcel } from 'react-export-table-to-excel';
import { getKategori } from '../../utils/helpers';
import { UseAuth } from '../../routes/useAuth';

const ListViewKategori = ({ kategori, nodes, selected_event }) => {
    const auth = UseAuth()

    const [isExpanded, setIsExpanded] = useState(false);

    const handleClick = () => {
        setIsExpanded(() => !isExpanded);
    };
    const current_kategori = getKategori(kategori, selected_event.kategori ? selected_event.kategori : [])

    const SubItem = ({ subelement, index }) => {
        const skorList = []
        for (let p = 0; p < subelement.data.length; p++) {
            skorList.push(
                <td key={"skor-" + Math.floor(Math.random() * 1001)}>{subelement.data[p].skor}</td>
            )
        }

        return (
            index > 0 ?
                <tr>
                    <td colSpan={4}></td>
                    <td>{subelement.rambahan}</td>
                    {skorList}
                    <td>{subelement.total_skor_rambahan}</td>
                    <td>{subelement.skor_max1}</td>
                    <td>{subelement.skor_max2}</td>
                    <td>{subelement.skor_max3}</td>
                </tr>
                : null
        )
    }

    const Item = ({ element, index }) => {
        const skorList = []
        for (let p = 0; p < element.data[0].data.length; p++) {
            skorList.push(
                <td key={"skor-" + Math.floor(Math.random() * 1001)}>{element.data[0].data[p].skor}</td>
            )
        }

        return (
            <>
                <tr key={element.collection + "-1"}>
                    <td>{element.rank}</td>
                    <td>{element.nama}</td>
                    <td>{element.tim}</td>
                    <td>{element.kode_peserta}</td>
                    {isExpanded ?
                        <>
                            <td>{element.data[0].rambahan}</td>
                            {skorList}
                            <td>{element.data[0].total_skor_rambahan}</td>
                            <td>{element.data[0].skor_max1}</td>
                            <td>{element.data[0].skor_max2}</td>
                            <td>{element.data[0].skor_max3}</td>
                        </>
                        :
                        <>
                            <th style={{ backgroundColor: 'red' }}>{element.total_skor}</th>
                            <th style={{ backgroundColor: 'yellow' }}>{element.total_skor_max1}</th>
                            <th style={{ backgroundColor: 'yellow' }}>{element.total_skor_max2}</th>
                            <th style={{ backgroundColor: 'yellow' }}>{element.total_skor_max3}</th>
                        </>}
                </tr>

                {isExpanded ?
                    element.data.map((element, index) => (
                        <SubItem key={"sub-" + element.collection} subelement={element} index={index} />
                    ))
                    : null}

                {isExpanded ?
                    <tr key={element.collection + "-2"}>
                        <td colSpan={5 + skorList.length}></td>
                        <th style={{ backgroundColor: 'red' }}>{element.total_skor}</th>
                        <th style={{ backgroundColor: 'yellow' }}>{element.total_skor_max1}</th>
                        <th style={{ backgroundColor: 'yellow' }}>{element.total_skor_max2}</th>
                        <th style={{ backgroundColor: 'yellow' }}>{element.total_skor_max3}</th>
                    </tr>
                    : null
                }
            </>
        )
    }

    const th = [];
    for (let index = 0; index < nodes[0].data[0].data.length; index++) {
        th.push(
            <th key={"th-" + index}>A{index + 1}</th>
        )
    }

    const exportPDF = () => {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(14);

        const title = "Ranking Individu " + kategori;
        const headers = [["Ranking", "Nama Pegiat", "Nama Klub/Provinsi", "Kode Pegiat", "Total Skor", "Skor " + current_kategori.max_poin, "Skor " + (current_kategori.max_poin - 1), "Skor " + (current_kategori.max_poin - 2)]];

        const data = nodes.map(elt => [elt.rank, elt.nama, elt.tim, elt.kode_peserta, elt.total_skor, elt.total_skor_max1, elt.total_skor_max2, elt.total_skor_max3]);

        let content = {
            startY: 50,
            head: headers,
            body: data
        };

        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("Ranking Individu " + kategori + ".pdf")
    }

    const exportExcel = () => {
        const header = ["Ranking", "Nama Pegiat", "Nama Klub/Provinsi", "Kode Pegiat", "Total Skor", "Skor " + current_kategori.max_poin, "Skor " + (current_kategori.max_poin - 1), "Skor " + (current_kategori.max_poin - 2)];
        const body = nodes.map(elt => [elt.rank, elt.nama, elt.tim, elt.kode_peserta, elt.total_skor, elt.total_skor_max1, elt.total_skor_max2, elt.total_skor_max3]);

        downloadExcel({
            fileName: "Ranking Individu " + kategori,
            sheet: "Ranking Individu " + kategori,
            tablePayload: {
                header,
                body: body,
            },
        })
    }

    return (
        <div className='mt-3' key={kategori}>
            <div className='d-flex flex-row p-2 bg-success align-items-center justify-content-center'>
                <h6 className='text-white mb-0 me-auto'>Kategori {kategori}</h6>
                {auth.user ?
                    <>
                        <button onClick={() => exportExcel()} className="btn btn-sm btn-info px-3 text-white me-2"><i className="fa fa-download"></i></button>
                        <button onClick={() => exportPDF()} className="btn btn-sm btn-info px-3 text-white me-2"><i className="fa fa-print"></i></button>
                    </>
                    : null}
                <button onClick={handleClick} className="btn btn-sm btn-info px-3 text-white"><i className={isExpanded ? "fa fa-compress" : "fa fa-expand"}></i></button>
            </div>
            <div className="table-responsive p-2">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Ranking</th>
                            <th>Nama Pegiat</th>
                            <th>Nama Klub/Provinsi</th>
                            <th>Kode Pegiat</th>
                            {isExpanded ?
                                <>
                                    <th>Seri</th>
                                    {th}
                                </>
                                : null}
                            <th>Total Skor</th>
                            <th>Skor {current_kategori.max_poin}</th>
                            <th>Skor {current_kategori.max_poin - 1}</th>
                            <th>Skor {current_kategori.max_poin - 2}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {nodes.map((element, index) => (
                            <Item key={element.collection} element={element} index={index} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const RankingIndividu = (props) => {
    const [ListKategori, setListKategori] = useState([]);
    const [ListSearch, setListSearch] = useState([]);
    const [list, setList] = useState([]);
    const [selectedKategori, setSelectedKategori] = useState("");
    const [search, setSearch] = useState('');
    const selected_event = props.selected_event
    const data = props.data

    useEffect(() => {
        grupSkor(data);
    }, [data])

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
        const arrKategori = [];
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

            arrKategori.push(nodes)

            listKategori.push({ label: elementKat, value: index });
        });

        setList(listKategori);

        setListKategori(arrKategori);
    }

    function searchFilter(text) {
        setSearch(text);

        const newData = ListKategori[selectedKategori].filter(item => {
            const itemData = `${item.kode_peserta.toUpperCase()} || ${item.nama.toUpperCase()} || ${item.tim.toUpperCase()}`
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });

        setListSearch(newData);
    }

    return (
        <>
            <div className="container">
                <img className="logo-1 mt-2" src={process.env.REACT_APP_imageURL.replace('.php', '/') + selected_event.logo} />
                <h6 className='mt-2'>{selected_event.nama_event}</h6>

                <div className="mt-2">
                    <label className="form-label">Kategori</label>
                    <Select isSearchable value={[list.find(({ value }) => value === selectedKategori)]} placeholder="Pilih Kategori" options={list} onChange={(element) =>
                    (
                        setSelectedKategori(element.value),
                        setSearch('')
                    )} />
                </div>
            </div>
            {selectedKategori !== '' ?
                <>
                    <div className="input-group me-auto mx-2 mt-3" style={{ maxWidth: 300 }}>
                        <span className="input-group-text">Cari Pegiat</span>
                        <input type="text" className="form-control" value={search} onChange={(event) => searchFilter(event.target.value)} />
                    </div>

                    {search ?
                        ListSearch.length > 0 ?
                            <ListViewKategori kategori={list.find(({ value }) => value === selectedKategori).label} nodes={ListSearch} selected_event={selected_event} />
                            :
                            <h6 className='text-center text-white mt-4 bg-danger p-3'>Data tidak ditemukan</h6>
                        :
                        <ListViewKategori kategori={list.find(({ value }) => value === selectedKategori).label} nodes={ListKategori[selectedKategori]} selected_event={selected_event} />

                    }
                </>
                : null}
        </>
    )
}

export default RankingIndividu