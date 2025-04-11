import { useAtom } from "jotai";
import { initialSettingAtom } from "./atom";
import { useNavigate } from "react-router-dom";

const InitialPage = () => {
  const [state, setState] = useAtom(initialSettingAtom);

  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label htmlFor='vtSize'>vtSize</label>
      <select
        name="vtSize"
        onChange={(e) =>
          setState((prev) => ({
            ...prev,
            vtSize: Number(e.target.value),
          }))
        }
        value={state.vtSize}
        id="vtSize">
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
      </select>
      <label htmlFor='hztSize'>hztSize</label>
      <select
        name="hztSize"
        onChange={(e) =>
          setState((prev) => ({
            ...prev,
            hztSize: Number(e.target.value),
          }))
        }
        value={state.hztSize}
        id="hztSize">
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
      </select>
      <label htmlFor='mines'>mines</label>
      <select
        name="mines"
        onChange={(e) =>
          setState((prev) => ({
            ...prev,
            mines: Number(e.target.value),
          }))
        }
        value={state.mines}
        id="mines">
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
      </select>
      <button onClick={()=>navigate("/game")}>go</button>
    </div>
  );
};

export default InitialPage;
