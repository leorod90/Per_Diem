describe('TimeScreen logic', () => {
  const mockSetSelectedTimeZone = jest.fn();
  const mockSetSelectedTime = jest.fn();
  const mockSetSelectedDate = jest.fn();
  const mockNavigationPop = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const roundToNearest30 = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const roundedMinutes = Math.round(minutes / 30) * 30;
    if (roundedMinutes === 60) {
      return `${hours + 1}:00`;
    }
    return `${hours}:${roundedMinutes.toString().padStart(2, '0')}`;
  };

  const checkIfOpenOnDate = async (time, date) => {
    // Mock store hours logic - store open 9-17
    const [hours] = time.split(':').map(Number);
    return hours >= 9 && hours < 17;
  };

  const setTimeHandler = async (time, tempDate) => {
    if (!tempDate) return;

    const roundedTime = roundToNearest30(time);
    mockSetSelectedTime(roundedTime);
    
    const isStoreOpen = await checkIfOpenOnDate(roundedTime, tempDate);
    mockSetSelectedDate({ ...tempDate, isStoreOpen });
    
    mockNavigationPop();
  };

  it('rounds time to nearest 30 minutes', () => {
    expect(roundToNearest30('14:23')).toBe('14:30');
    expect(roundToNearest30('14:37')).toBe('14:30');
    expect(roundToNearest30('14:45')).toBe('15:00');
    expect(roundToNearest30('14:52')).toBe('15:00');
  });

  it('checks if store is open during business hours', async () => {
    expect(await checkIfOpenOnDate('10:00', {})).toBe(true);
    expect(await checkIfOpenOnDate('16:30', {})).toBe(true);
    expect(await checkIfOpenOnDate('8:00', {})).toBe(false);
    expect(await checkIfOpenOnDate('18:00', {})).toBe(false);
  });

  it('handles time confirmation with valid date', async () => {
    const tempDate = { day: 15, month: 'Dec' };
    
    await setTimeHandler('14:23', tempDate);
    
    expect(mockSetSelectedTime).toHaveBeenCalledWith('14:30');
    expect(mockSetSelectedDate).toHaveBeenCalledWith({
      day: 15,
      month: 'Dec',
      isStoreOpen: true
    });
    expect(mockNavigationPop).toHaveBeenCalled();
  });

  it('does nothing when tempDate is missing', async () => {
    await setTimeHandler('14:23', null);
    
    expect(mockSetSelectedTime).not.toHaveBeenCalled();
    expect(mockSetSelectedDate).not.toHaveBeenCalled();
    expect(mockNavigationPop).not.toHaveBeenCalled();
  });

  it('sets store as closed for after hours selection', async () => {
    const tempDate = { day: 15, month: 'Dec' };
    
    await setTimeHandler('19:00', tempDate);
    
    expect(mockSetSelectedDate).toHaveBeenCalledWith({
      day: 15,
      month: 'Dec',
      isStoreOpen: false
    });
  });
});