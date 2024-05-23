import { OnSubscription, Subject } from "../subject";
export declare function subject<T>(value?: T, onSubscription?: OnSubscription<T>): Subject<T>;
export declare namespace subject {
    var all: {
        <A, B, C, D, E, F>(args: [A | Subject<A>, B | Subject<B>, C | Subject<C>, D | Subject<D>, E | Subject<E>, F | Subject<F>]): Subject<[A, B, C, D, E, F]>;
        <A_1, B_1, C_1, D_1, E_1>(args: [A_1 | Subject<A_1>, B_1 | Subject<B_1>, C_1 | Subject<C_1>, D_1 | Subject<D_1>, E_1 | Subject<E_1>]): Subject<[A_1, B_1, C_1, D_1, E_1]>;
        <A_2, B_2, C_2, D_2>(args: [A_2 | Subject<A_2>, B_2 | Subject<B_2>, C_2 | Subject<C_2>, D_2 | Subject<D_2>]): Subject<[A_2, B_2, C_2, D_2]>;
        <A_3, B_3, C_3>(args: [A_3 | Subject<A_3>, B_3 | Subject<B_3>, C_3 | Subject<C_3>]): Subject<[A_3, B_3, C_3]>;
        <A_4, B_4>(args: [A_4 | Subject<A_4>, B_4 | Subject<B_4>]): Subject<[A_4, B_4]>;
        <A_5>(args: [A_5 | Subject<A_5>]): Subject<[A_5]>;
    };
}
