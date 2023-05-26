import moment from "moment";

const onAksi = (element, onSelectEvent) => {
    onSelectEvent(element)
}

const Item = ({ element, index, onSelectEvent }) => {
    return (
        <div onClick={() => onAksi(element, onSelectEvent)} key={'event-' + index + "-" + element.collection} className="col-sm-6 col-xl-3">
            <div className="shadow rounded mb-3 mt-2">
                <div className="d-flex flex-column p-3 justify-content-center">
                    <img className="img-fluid rounded w-100" style={{ maxHeight: window.innerHeight / 2 }} src={process.env.REACT_APP_imageURL.replace('.php', '/') + element.poster} />
                    <h5 className="mt-3">{element.nama_event}</h5>
                    <h6>{moment(element.tanggal_mulai.toDate()).format('DD MMM YYYY')} - {moment(element.tanggal_selesai.toDate()).format('DD MMM YYYY')}</h6>

                    <div className="d-flex flex-row">
                        <button onClick={() => onAksi(element, onSelectEvent)} className="btn btn-sm btn-info px-3 text-white">Rekapitulasi Poin</button>
                        {/* <button onClick={() => onAksi(element, onSelectEvent)} className="btn btn-sm btn-info px-3 text-white">Aduan</button> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export const ItemEvent = ({ data, onSelectEvent }) => {
    return (
        <div className="row m-0">
            {data.map((element, index) => (
                <Item key={index} element={element} index={index} onSelectEvent={onSelectEvent} />
            ))}
        </div>
    );
}