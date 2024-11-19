import React from "react";

class MatrikelTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matrListe: props.matrListe,
      shorterLength:
        props.shorterLength === undefined
          ? 40
          : parseInt(props.shorterLength, 10),
    };
  }

  shorter(text) {
    var l = this.state.shorterLength;
    if (text.length > l) {
      return text.slice(0, l - 3) + "...";
    } else {
      return text;
    }
  }

  _handleDelete(id) {
    this.props._handleDelete(id);
  }

  _handleFocus(id) {
    this.props._handleFocus(id);
    const { shorterLength } = this.state;
    return text.length > shorterLength
      ? `${text.slice(0, shorterLength - 3)}...`
      : text;
  }

  render() {
    const { matrListe } = this.props;

    if (matrListe.length === 0) {
      return <p>Der er ikke tilknyttet nogen matrikler endnu.</p>;
    } else {
      return (
        <div className="mt-3">
          <table className="table table-sm">
            <colgroup>
              <col style={{ width: "10%" }} />
              <col style={{ width: "80%" }} />
            </colgroup>
            <thead>
              <tr>
                <th>Værktøj</th>
                <th>Matrikel</th>
              </tr>
            </thead>
            <tbody>
              {matrListe.map((matr) => (
                <tr
                  key={`geosag-matrikelliste-${matr.ejerlavskode}${matr.kommunenr}${matr.matrikelnr}`}
                >
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <button
                        className="btn"
                        onClick={this._handleFocus.bind(this, matr)}
                        disabled={!matr.hasGeometry}
                        title="Vis matrikel i kortet"
                      >
                        <i className="bi bi-search"></i>
                      </button>
                      <button
                        className="btn"
                        onClick={this._handleDelete.bind(this, matr)}
                        title="Fjern matrikel fra listen."
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                  <td className="align-middle">{`${
                    matr.matrikelnr
                  }, ${this.shorter(matr.ejerlavsnavn)}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  }
}

export default MatrikelTable;
