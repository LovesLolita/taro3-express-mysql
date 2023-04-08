import  { memo } from 'react'
import { Calendar } from '@nutui/nutui-react-taro';
import { MIN_DATE, MAX_DATE } from '@/common/constant'
import { connect } from 'react-redux'

// redux 数据
const mapStateToProps = (state) => {
  return {
    dptDate: state.flightIndex.dptDate
  };
}

const CalendarView =memo((props) => {

  // 关闭日历
  const closeSwitch = () => {
    props.switchCalendar(false);
  }

  // 更改时间
  const setChooseValue = (param) => {
      props.dispatch({
        type: 'flightIndex/updateState',
        payload: {
          dptDate: param[3]
        }
      })
  }
  return (
      <>
          <Calendar 
            visible={props.isVisible}
            defaultValue={props.dptDate}
            startDate={MIN_DATE}
            endDate={MAX_DATE}
            onClose={closeSwitch}
            onChoose={setChooseValue}
          />
      </>
  );
})

export default connect(mapStateToProps)(CalendarView);