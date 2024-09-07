import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { useState, useCallback, useRef } from 'react';
import { useItem, useSetItem } from './states';
import { Dept } from './Types';

const store: Dept[] = [
    { id: 1, name: 'Target', shortcut: 'target' },
    { id: 2, name: 'Starbucks', shortcut: 'starbucks' },
    { id: 3, name: 'Subway', shortcut: 'subway' },
    { id: 4, name: 'Cafés', shortcut: 'cafe' },
    { id: 5, name: 'Gas stations', shortcut: 'gas' },
    { id: 6, name: 'Fast food', shortcut: 'fastfood' },
    { id: 7, name: 'CVS Pharmacy', shortcut: 'cvs' },
    { id: 8, name: 'McDonald\'s', shortcut: 'mcdonalds' },
    { id: 9, name: 'Burger King', shortcut: 'burgerking' },
    { id: 10, name: 'Chick-fil-A', shortcut: 'chickfila' },
    { id: 11, name: 'Lowe\'s', shortcut: 'lowes' },
    { id: 12, name: 'Home Depot', shortcut: 'homedepot' },
    { id: 13, name: 'Vons', shortcut: 'vons' },
    { id: 14, name: 'Walmart', shortcut: 'walmart' },
    { id: 15, name: 'Trader Joe\'s', shortcut: 'traderjoes' },
    { id: 16, name: 'Chase Bank', shortcut: 'chase' },
    { id: 17, name: 'Bank of America', shortcut: 'bofa' },
    { id: 18, name: 'Best Buy', shortcut: 'bestbuy' },
    { id: 19, name: 'Barnes & Noble', shortcut: 'barnes' },
    { id: 20, name: 'Walgreens', shortcut: 'walgreens' },
    { id: 21, name: 'Whole Foods Market', shortcut: 'wholefoods' },
];

export default function Example() {
    const [query, setQuery] = useState<string>('');
    const item = useItem();
    const setItem = useSetItem();
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredPeople = query === ''
        ? store
        : store.filter((store) => store.name.toLowerCase().includes(query.toLowerCase()));

    const handleChange = useCallback((value: Dept | null) => {
        setItem(value);
    }, [setItem]);

    return (
        <div className="p-2 inset-x-0 absolute z-10">
            <Combobox value={item} onChange={handleChange}>
                <div className="relative">
                    <ComboboxInput
                        ref={inputRef}
                        className={clsx(
                            'w-full rounded-md border-none bg-white py-2 pr-8 pl-8 text-base text-black'
                        )}
                        displayValue={(store: Dept | null) => store?.name || ''}
                        onChange={(event) => setQuery(event.target.value)}
                        aria-label="Assignee"
                    />
                    <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                        <ChevronDownIcon className="size-4 fill-black/60 group-data-[hover]:fill-white" />
                    </ComboboxButton>
                </div>

                <ComboboxOptions
                    className={clsx(
                        'w-[var(--input-width)] rounded-md py-2 pr-8 pl-3 bg-white [--anchor-gap:var(--spacing-1)]',
                        'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0',
                        'max-h-60 overflow-auto' // Add these classes for scrollability
                    )}
                >
                    {filteredPeople.map((store) => (
                        <ComboboxOption
                            key={store.id}
                            value={store}
                            className="group flex cursor-default rounded-md py-2 pr-8 select-none data-[focus]:bg-black/10"
                        >
                            <CheckIcon className="invisible size-4 pr-6 fill-white group-data-[selected]:visible" />
                            <div className="text-sm/6 text-black">{store.name}</div>
                        </ComboboxOption>
                    ))}
                </ComboboxOptions>
            </Combobox>
        </div>
    );
}
