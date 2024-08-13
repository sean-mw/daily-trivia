import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faAngleUp,
  faAngleLeft,
  faAngleRight,
  faAngleDown,
} from '@fortawesome/free-solid-svg-icons'

const ArrowDiamond = () => {
  return (
    <div className="flex flex-col items-center">
      <FontAwesomeIcon icon={faAngleUp} size="2x" className="text-black" />
      <div className="flex gap-10">
        <FontAwesomeIcon icon={faAngleLeft} size="2x" className="text-black" />
        <FontAwesomeIcon icon={faAngleRight} size="2x" className="text-black" />
      </div>
      <FontAwesomeIcon icon={faAngleDown} size="2x" className="text-black" />
    </div>
  )
}

export default ArrowDiamond
