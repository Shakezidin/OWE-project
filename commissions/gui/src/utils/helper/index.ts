interface props{
    sortKey:string,
    data:any[],
    direction:string
}
 export const sortByKey = <T>(array: T[], key: keyof T, direction: 'asc' | 'desc'): T[] => {
   return [...array].sort((a, b) => {
     const aValue = a[key];
     const bValue = b[key];
 
     if (typeof aValue === 'string' && typeof bValue === 'string') {
       return direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
     } else {
       const numericAValue = typeof aValue === 'number' ? aValue : parseFloat(aValue as string);
       const numericBValue = typeof bValue === 'number' ? bValue : parseFloat(bValue as string);
       return direction === 'asc' ? numericAValue - numericBValue : numericBValue - numericAValue;
     }
   });
 };
 
  
